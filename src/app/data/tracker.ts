import {UUIDUtils} from '../utils/uuid-utils';
import {App} from '../app';
import {Locale} from '../locale/locale';
import {SmsIo} from '../io/sms-io';
import {InformationData, LocationData, MessageDirection, MessageType, TrackerMessage} from './tracker-message';
import {Modal} from '../screens/modal';
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
     * License plate of the vehicle where the tracker is placed
     */
    public licensePlate: string = '';

    /**
     * Chassis number of the vehicle  where the tracker is placed
     */
    public chassisNumber: string = '';

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
     * ID of the tracker device, each tracker has its own ID.
     */
    public id: string;

    constructor() {
        this.uuid = UUIDUtils.generate();
    }

    /**
     * Navigate to a GPS position, should open in external application.
     *
     * The phone should ask which application to use.
     *
     * @param position GPS position to navigate to.
     */
    public navigateGPS(position?: GPSPosition) {
        // If position not defined use the last GPS position.
        if (position === undefined) {
            position = this.getLastPosition();
        }

        // Show error if no position is available.
        if (position === null) {
            Modal.alert(Locale.get('error'), Locale.get('errorNavigate'));
            return;
        }

        // Open as a google maps link
        const url = 'http://maps.google.com/maps?q=' + position.latitude + ',' + position.longitude;
        window.open(url, App.isMobile() ? '_system' : '_blank');
    }

    /**
     * Get last known location of the tracker from its message list.
     */
    public getLastPosition(): GPSPosition {
        for (let i = this.messages.length - 1; i >= 0; i--) {
            if (this.messages[i].type === MessageType.LOCATION && this.messages[i].data.position !== null) {
                return this.messages[i].data.position;
            }
        }

        return null;
    }

    /**
     * Add message to the list of messages in the tracker.
     *
     * @param message Message to be stored in the tracker.
     */
    public addMessage(message: TrackerMessage) {
        this.messages.push(message);
        App.store();
    }

    /**
     * Process a message received from SMS and store its result on a tracker message.
     *
     * @param message Message received.
     */
    public processSMS(message: string) {
        let msg = new TrackerMessage(MessageDirection.RECEIVED);
        msg.rawData = message;

        // Acknowledge message
        const ackMsg = message.toLowerCase();
        if (ackMsg === 'admin ok' || ackMsg === 'apn ok' || ackMsg === 'password ok' || ackMsg === 'speed ok' || ackMsg === 'ok') {
            msg.type = MessageType.ACKNOWLEDGE;

            Modal.toast(Locale.get('trackerAcknowledge', {name: this.name}));
            this.addMessage(msg);
            return;
        }

        // List of SOS numbers
        if (message.startsWith('101#')) {
            msg.type = MessageType.SOS_NUMBERS;

            let numbers = message.split(' ');
            for (let i = 0; i < numbers.length;  i++) {
                this.sosNumbers[i] = numbers[i].substr(4);
            }

            Modal.toast(Locale.get('trackerAcknowledge', {name: this.name}));
            this.addMessage(msg);
            return;
        }

        // GPS Location
        if (message.startsWith('http')) {
            try {
                const regex = /https?\:\/\/maps\.google\.cn\/maps\??q?=?N?([\-0-9\.]*),?W?([\-0-9\.]*)\s*ID:([0-9]+)\s*ACC:([A-Z]+)\s*GPS:([A-Z]+)\s*Speed:([0-9\.]+) ?KM\/H\s*([0-9]+)\-([0-9]+)\-([0-9]+)\s*([0-9]+):([0-9]+):([0-9]+)/;
                let matches = message.match(regex);
                let data = new LocationData();

                if (matches[1].length > 0) {
                    data.position = new GPSPosition(Number.parseFloat(matches[1]), -Number.parseFloat(matches[2]));
                }
                data.id = matches[3];
                data.acc = matches[4] !== 'OFF';
                data.gps = matches[5] === 'A';
                data.speed = Number.parseFloat(matches[6]);

                let year = Number.parseInt(matches[7], 10) + 2000;
                let month = Number.parseInt(matches[8], 10);
                let day = Number.parseInt(matches[9], 10);
                data.date.setFullYear(year, month, day);

                let hour = Number.parseInt(matches[10], 10);
                let minute = Number.parseInt(matches[11], 10);
                let seconds = Number.parseInt(matches[12], 10);
                data.date.setHours(hour, minute, seconds);
                msg.data = data;
                msg.type = MessageType.LOCATION;

                this.id = data.id;
                Modal.toast(Locale.get('trackerLocation', {name: this.name}));

                this.addMessage(msg);
                return;
            } catch(e) {
                Modal.alert(Locale.get('error'), Locale.get('errorParseLocationMsg'));
                console.log('CarTracker: Error parsing location message.', e, this);
                this.addMessage(msg);
                return;
            }
        }

        // GPS Tracker data
        const infoRegex = /([A-Za-z0-9_\.]+) ([0-9]+)\/([0-9]+)\/([0-9]+)\s*ID:([0-9]+)\s*IP:([0-9\.a-zA-Z\\]+)\s*([0-9]+) BAT:([0-9])\s*APN:([0-9\.a-zA-Z\\]+)\s*GPS:([0-9A-Z\-]+)\s*GSM:([0-9]+)\s*ICCID:([0-9A-Z]+)/;
        try {
            if (message.search(infoRegex) !== -1) {
                let matches = message.match(infoRegex);

                let data = new InformationData();
                data.model = matches[1];
                data.id = matches[5];
                data.ip = matches[6];
                data.port = matches[7];
                data.battery = Number.parseInt(matches[8], 10);
                data.apn = matches[9];
                data.gps = matches[10];
                data.gsm = matches[11];
                data.iccid = matches[12];
                msg.data = data;
                msg.type = MessageType.INFORMATION;

                this.battery = data.battery;
                this.model = data.model;
                this.apn = data.apn;
                this.iccid = data.iccid;
                this.id = data.id;

                Modal.toast(Locale.get('trackerUpdated', {name: this.name}));
                this.addMessage(msg);
                return;
            }
        }
        catch(e) {
            Modal.alert(Locale.get('error'), Locale.get('errorParseInfoMsg'));
            console.log('CarTracker: Error parsing device info message.', e, this);
            this.addMessage(msg);
            return;
        }

        Modal.toast(Locale.get('receivedUnknown', {name: this.name}));
        this.addMessage(msg);
    }

    /**
     * Send a message to this tracker, store it in the messages list.
     *
     * @param message Message to be sent to the tracker.
     */
    public sendSMS(message: TrackerMessage) {
        SmsIo.sendSMS(this.phoneNumber, message.data);
        this.addMessage(message);
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
