import {UUIDUtils} from '../utils/uuid-utils';
import {App} from '../app';
import {Locale} from '../locale/locale';
import {SmsIo} from '../io/sms-io';
import {MessageDirection, MessageType, TrackerMessage} from './tracker-message';
import {Modal} from '../screens/modal';
import {URLUtils} from '../utils/url-utils';
import {GPSPosition} from './gps-position';

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

    /**
     * Access Point Name (APN) configured on the tracker for GPRS data access.
     */
    public apn: string;

    /**
     * Integrated Circuit Card Identifier (ICCID) of the SIM card inserted in the tracker.
     */
    public iccid: string;

    /**
     * ID of the tracker device.
     */
    public id: string;

    constructor() {
        this.uuid = UUIDUtils.generate();
    }

    /**
     * Get last known location of the tracker from its message list.
     */
    public getLastPosition(): GPSPosition {
        for (let i = this.messages.length - 1; i >= 0; i--) {
            if (this.messages[i].type === MessageType.LOCATION && this.messages[i].data.position !== undefined) {
                return this.messages[i].data.position;
            }
        }

        return null;
    }

    /**
     * Process a message received from SMS and store its result on a tracker message.
     *
     * @param message Message received.
     */
    public receiveSMS(message: string) {
        let msg = new TrackerMessage(MessageDirection.RECEIVED);
        msg.rawData = message;

        // Acknowledge message
        if (message === 'admin ok' || message === 'apn ok' || message === 'password ok' || message === 'speed ok' || message === 'ok') {
            msg.type = MessageType.ACKNOWLEDGE;
            Modal.toast(Locale.get('trackerAcknowledge', {name: this.name}));
        }
        // List of SOS numbers
        else if (message.startsWith('101#')) {
            msg.type = MessageType.SOS_NUMBERS;
            // console.log('CarTracker: Received list of SOS numbers.', message);
            let numbers = message.split(' ');
            for (let i = 0; i < numbers.length;  i++) {
                this.sosNumbers[i] = numbers[i].substr(4);
            }
            Modal.toast(Locale.get('trackerAcknowledge', {name: this.name}));
        } else {
            // Multiline messages
            let fields = message.split('\n');

            // Location message
            if (fields.length === 6) {
                let coords = null;
                let values = fields[0].split('=');

                if(values.length > 1) {
                    values = values[1].split(',');
                    coords = new GPSPosition(
                        Number.parseFloat(values[0].substr(1)),
                        Number.parseFloat(values[1].substr(1))
                    );
                }

                msg.type = MessageType.LOCATION;
                msg.data = {
                    position: coords,
                    // tslint:disable-next-line:radix
                    id: Number.parseInt(fields[1].split(':')[1]),
                    acc: fields[2].split(':')[1] !== 'OFF',
                    gps: fields[3].split(':')[1] === 'A',
                    speed: Number.parseFloat(fields[4].split(':')[1]),
                    date: fields[5]
                };

                Modal.toast(Locale.get('trackerLocation', {name: this.name}));
            }

            // Information message
            if (fields.length === 8) {
                msg.type = MessageType.INFORMATION;
                msg.data = {
                    model: fields[0],
                    id: fields[1].split(':')[1],
                    ip: fields[2].split(':')[1],
                    battery: Number.parseInt(fields[3].split(':')[1], 10),
                    apn: fields[4].split(':')[1],
                    gps: fields[5].split(':')[1],
                    gsm: fields[6].split(':')[1],
                    iccid: fields[7].split(':')[1],
                };

                this.battery = msg.data.battery;
                this.model = msg.data.model;
                this.apn = msg.data.apn;
                this.iccid = msg.data.iccid;
                this.id = msg.data.id;

                Modal.toast(Locale.get('trackerUpdated', {name: this.name}));
            }
        }

        this.messages.push(msg);
        App.store();
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
