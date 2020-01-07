import {UUIDUtils} from '../utils/uuid-utils';
import {App} from '../app';
import {Locale} from '../locale/locale';

/**
 * Direction of the message.
 */
export const MessageDirection = {
    SENT: 1,
    RECEIVED: 2
};

/**
 * Type of messages to be received.
 */
export const MessageType = {
    COMMAND: 0,
    LOCATION: 1,
    UNKNOWN: -1
};

/**
 * Class to represent a message received from a tracker.
 */
export class TrackerMessage {
    /**
     * Direction of the data exchanged.
     */
    public direction: number;

    /**
     * Content of the message, can be a string or a object.
     */
    public data: any;

    /**
     * Date of the data.
     */
    public date: Date;

    /**
     * Type of the data.
     */
    public type: number;

    constructor(direction: number) {
        this.direction = direction;
        this.date = new Date();
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
     * Distance limit in meters before an alarm is triggered.
     */
    public distanceLimit: number = null;

    /**
     * Indicates if the tracker is active and should be displayed on the map.
     */
    public active: boolean = true;

    /**
     * Messages exchanged with the tracker device.
     */
    public messages: TrackerMessage[] = [];

    constructor() {
        this.uuid = UUIDUtils.generate();
    }

    public sendSMS(msg: TrackerMessage) {
        this.messages.push(msg);
        this.sendSMS(msg.data);
        App.store();
    }

    /**
     * Request a data with the location of the device, status and speed of the tracker.
     */
    public getLocation() {
        let msg = new TrackerMessage(MessageDirection.SENT);
        msg.type = MessageType.COMMAND;
        msg.data = 'g1234';

        this.sendSMS(msg.data);
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

        this.sendSMS(msg.data);
    }

    /**
     * Request a data with the location of the device, status and speed of the tracker.
     */
    public getTrackerInfo() {
        let msg = new TrackerMessage(MessageDirection.SENT);
        msg.type = MessageType.COMMAND;
        msg.data = 'CXZT';

        this.sendSMS(msg.data);
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

        this.sendSMS(msg.data);
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

        this.sendSMS(msg.data);
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

        this.sendSMS(msg.data);
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
        this.sendSMS(msg.data);
    }

    /**
     * Request a list of the SOS numbers registered on the device.
     */
    public listSOSNumbers() {
        let msg = new TrackerMessage(MessageDirection.SENT);
        msg.type = MessageType.COMMAND;
        msg.data = 'C10#';

        this.sendSMS(msg.data);
    }


    /**
     * Set the speed limit of the GPS tracker before an alarm is triggered.
     *
     * @param speed Speed limit in MPH zero means no speed limit.
     */
    public setSpeedLimit(speed: number) {
        let msg = new TrackerMessage(MessageDirection.SENT);
        msg.type = MessageType.COMMAND;
        msg.data = 'speed' + this.pin + ' ' + speed;

        this.speedLimit = speed;

        this.sendSMS(msg.data);
    }

    /**
     * Set the movement limit of the GPS tracker before an alarm is triggered.
     *
     * @param distance Distance limit in meters.
     */
    public setMoveLimit(distance: number) {
        let msg = new TrackerMessage(MessageDirection.SENT);
        msg.type = MessageType.COMMAND;
        msg.data = 'move' + this.pin + ' ' + distance;

        this.distanceLimit = distance;

        this.sendSMS(msg.data);
    }

    /**
     * Disable the movement alarm.
     */
    public noMove() {
        let msg = new TrackerMessage(MessageDirection.SENT);
        msg.type = MessageType.COMMAND;
        msg.data = 'nomove' + this.pin;

        this.distanceLimit = null;

        this.sendSMS(msg.data);
    }

}
