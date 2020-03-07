import {UUIDUtils} from '../utils/uuid-utils';
import {App} from '../app';
import {Locale} from '../locale/locale';
import {SmsIo} from '../io/sms-io';

/**
 * Direction of the message.
 */
export const MessageDirection = {
    SENT: 1,
    RECEIVED: 2
};

/**
 * Type of messages exchanged between the tracker and the phone.
 *
 * Applies to booth sent and received messages.
 */
export const MessageType = {
    COMMAND: 0,
    LOCATION: 1,
    ACKNOWLEDGE: 2,
    INFORMATION: 3,
    UNKNOWN: -1
};

/**
 * Label of the messages type available.
 */
export const MessageTypeLabel: Map<number, string> = new Map([
    [MessageType.COMMAND, 'command'],
    [MessageType.LOCATION, 'location'],
    [MessageType.ACKNOWLEDGE, 'acknowledge'],
    [MessageType.INFORMATION, 'information'],
    [MessageType.UNKNOWN, 'unknown']
]);

/**
 * Class to represent a message received from a tracker.
 */
export class TrackerMessage {
    /**
     * Type of the message exchanged.
     */
    public type: number;

    /**
     * Direction of the data exchanged.
     */
    public direction: number;

    /**
     * Decoded content of the message.
     */
    public data: any;

    /**
     * Original message content as received.
     */
    public rawData: string;

    /**
     * Date of the message.
     */
    public date: Date;

    constructor(direction: number) {
        this.direction = direction;
        this.date = new Date();
        this.type = MessageType.UNKNOWN;
    }
}

/**
 * Tracker represents a GPS tracker, contains all the metadata required to communicate with the tracker.
 */
export class Tracker {
    /**
     * UUID used to identify the tracker.
     */
    public uuid: string;

    /**
     * Name of the tracker.
     */
    public name: string = '';

    /**
     * Model of the tracker.
     */
    public model: string = '';

    /**
     * Color to represent the tracker on the map.
     */
    public color: string = null;

    /**
     * Phone number of the tracker used to send and receive messages.
     */
    public phoneNumber: string = '';

    /**
     * Admin number of the tracker.
     */
    public adminNumber: string = '';

    /**
     * SOS numbers associated with the tracker (up to 3 SOS numbers).
     */
    public sosNumbers: string[];

    /**
     * PIN number of the tracker used for authentication.
     *
     * Usually it is a 4 digit numeric pin.
     */
    public pin: string = '';

    /**
     * Limit speed in miles per hour, defined on the tracker.
     */
    public speedLimit: number = null;

    /**
     * Time limit before the tracker enters into sleep mode.
     */
    public sleepLimit: number = null;

    /**
     * Indicates if the tracker is active and should be displayed on the map.
     */
    public active: boolean = true;

    /**
     * If enabled the ignition alarm is fired every time the ACC signal changes.
     *
     * If the signal is not connected to the car it will not fire.
     */
    public ignitionAlarm: boolean = false;

    /**
     * Messages exchanged with the tracker device.
     */
    public messages: TrackerMessage[] = [];

	/**
	 * Indicates if the alarm sends an SMS to the admin it power was unplugged.
	 */
	public powerAlarmSMS: boolean = false;

	/**
	 * Indicates if the alarm calls the admin it power was unplugged.
	 */
	public powerAlarmCall: boolean = false;

    /**
     * Level of battery of the tracker, has to be read manually using the info command.
     *
     * Value from 1 to 5, 5 meaning fully charged.
     */
    public battery: number = 0;

    constructor() {
        this.uuid = UUIDUtils.generate();
    }

    /**
     * Get last known location of the tracker.
     */
    public getLastLocation(): any {

    }

    /**
     * Send a message to this tracker, store it in the messages list.
     *
     * @param msg Message to be sent to the tracker.
     */
    public sendSMS(msg: TrackerMessage) {
        this.messages.push(msg);
        SmsIo.sendSMS(this.phoneNumber, msg.data);
        App.store();
    }

    /**
     * Request a data with the location of the device, status and speed of the tracker.
     */
    public getLocation() {
        let msg = new TrackerMessage(MessageDirection.SENT);
        msg.type = MessageType.COMMAND;
        msg.data = 'g1234';

        this.sendSMS(msg);
    }

    /**
     * Change the timezone of tracker.
     *
     * @param timezone Timezone to be used by the tracker.
     */
    public setTimezone(timezone: string) {
        let msg = new TrackerMessage(MessageDirection.SENT);
        msg.type = MessageType.COMMAND;
        msg.data = 'zone' + this.pin + ' ' + timezone;

        this.sendSMS(msg);
    }

    /**
     * Request a data with the location of the device, status and speed of the tracker.
     */
    public getTrackerInfo() {
        let msg = new TrackerMessage(MessageDirection.SENT);
        msg.type = MessageType.COMMAND;
        msg.data = 'CXZT';

        this.sendSMS(msg);
    }

    /**
     * Change the pin of the tracker.
     *
     * @param newPin New pin to be set on the tracker.
     */
    public changePIN(newPin: string) {
        let msg = new TrackerMessage(MessageDirection.SENT);
        msg.type = MessageType.COMMAND;
        msg.data = 'password' + this.pin + ' ' + newPin;

        this.pin = newPin;
        App.store();

        this.sendSMS(msg);
    }

    /**
     * Set admin number used for the admin related information.
     *
     * @param phoneNumber Phone number use for control.
     */
    public setAdminNumber(phoneNumber: string) {
        let msg = new TrackerMessage(MessageDirection.SENT);
        msg.type = MessageType.COMMAND;
        msg.data = 'admin' + this.pin + ' ' + phoneNumber;

        this.adminNumber = phoneNumber;
        this.sendSMS(msg);
    }

    /**
     * Set sos number used for the GPS to return requested information, alarm messages etc.
     *
     * @param phoneNumber Phone number use for control.
     * @param slot Slot being set can be 1, 2 or 3.
     */
    public setSOSNumber(phoneNumber: string, slot: number) {
        if (slot < 1 || slot > 3) {
           throw new Error(Locale.get('errorInvalidSlot'));
        }

        let msg = new TrackerMessage(MessageDirection.SENT);
        msg.type = MessageType.COMMAND;
        msg.data = '10' + slot + '#' + phoneNumber + '#';

        this.sosNumbers[slot - 1] = phoneNumber;
        this.sendSMS(msg);
    }


    /**
     * Delete SOS number used for the GPS to return requested information, alarm messages etc.
     *
     * @param slot Slot being set can be 1, 2 or 3.
     */
    public deleteSOSNumber(slot: number) {
        if (slot < 1 || slot > 3) {
            throw new Error(Locale.get('errorInvalidSlot'));
        }

        let msg = new TrackerMessage(MessageDirection.SENT);
        msg.type = MessageType.COMMAND;
        msg.data = 'D10' + slot + '#';

        this.sosNumbers[slot - 1] = '';
        this.sendSMS(msg);
    }

    /**
     * Request a list of the SOS numbers registered on the device.
     */
    public listSOSNumbers() {
        let msg = new TrackerMessage(MessageDirection.SENT);
        msg.type = MessageType.COMMAND;
        msg.data = 'C10#';

        this.sendSMS(msg);
    }

	/**
	 * Enable/disable ignition auto security, used for the tracker to send and SMS every time the car ignition is switched.
	 *
	 * @param enabled State of the ignition alarm.
	 */
	public setIgnitionAlarm(enabled: boolean) {
        let msg = new TrackerMessage(MessageDirection.SENT);
        msg.type = MessageType.COMMAND;
        msg.data = 'accclock,' + this.pin + ',' + (enabled ? '1' : '0');

        this.ignitionAlarm = enabled;
        this.sendSMS(msg);
	}

	/**
	 * Configure the tracker to call the admin phone if the power is disconnected from the device.
	 *
	 * @param enabled State of the power alarm.
	 */
	public setPowerAlarmCall(enabled: boolean) {
        let msg = new TrackerMessage(MessageDirection.SENT);
        msg.type = MessageType.COMMAND;
        msg.data = 'pwrcall,' + this.pin + ',' + (enabled ? '1' : '0');

        this.powerAlarmCall = enabled;
        this.sendSMS(msg);
	}

	/**
	 * Configure the tracker to send a SMS alarm if the power is disconnected from the device.
	 *
	 * @param enabled State of the power alarm.
	 */
	public setPowerAlarmSMS(enabled: boolean) {
        let msg = new TrackerMessage(MessageDirection.SENT);
        msg.type = MessageType.COMMAND;
        msg.data = 'pwrsms,' + this.pin + ',' + (enabled ? '1' : '0');
		
        this.powerAlarmSMS = enabled;
        this.sendSMS(msg);
	}

    /**
     * Set the speed limit of the GPS tracker before an alarm is triggered.
     *
     * @param speed Speed limit in MPH zero means no speed limit.
     */
    public setSpeedLimit(speed: number) {
        if (speed > 999) {
            speed = 999;
        }

        // Round speed value
        speed = Math.round(speed);

        // Covert into 3 digit string
        let strSpeed = speed.toString();
        while (strSpeed.length < 3) {
            strSpeed = '0' + strSpeed;
        }

        let msg = new TrackerMessage(MessageDirection.SENT);
        msg.type = MessageType.COMMAND;
        msg.data = 'speed' + this.pin + ' ' + strSpeed;

        this.speedLimit = speed;
        this.sendSMS(msg);
    }

    /**
     * Set the time of the GPS before it enters sleep mode after being used (wakes up by movement or sms).
     *
     * @param time Time limit in minutes, if set to zero it will disable sleep.
     */
    public setSleepTime(time: number) {
        let msg = new TrackerMessage(MessageDirection.SENT);
        msg.type = MessageType.COMMAND;
        msg.data = 'sleep,' + this.pin + ',' + time;

        this.sleepLimit = time;
        this.sendSMS(msg);
    }
}
