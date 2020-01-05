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
     * Color to represent the tracker on the map.
     */
    public color: string = null;

    /**
     * Phone number of the tracker used to send and receive messages.
     */
    public phoneNumber: string = '';

    /**
     * PIN number of the tracker used for authentication.
     *
     * Usually it is a 4 digit numeric pin.
     */
    public pin: string = '';

    /**
     * Battery level, 5 is 100%, 1 is 20%; the battery is from 1 to 5.
     */
    public battery: number = null;

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

    /**
     * Request a data with the location of the device, status and speed of the tracker.
     */
    public getLocation() {
        let msg = new TrackerMessage(MessageDirection.SENT);
        msg.type = MessageType.COMMAND;
        msg.data = 'g1234';

        App.sendSMS(this.phoneNumber, msg.data);
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

        App.sendSMS(this.phoneNumber, msg.data);
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

        App.sendSMS(this.phoneNumber, msg.data);
    }

    /**
     * Disable the movement alarm.
     */
    public noMove() {
        let msg = new TrackerMessage(MessageDirection.SENT);
        msg.type = MessageType.COMMAND;
        msg.data = 'nomove' + this.pin;

        this.distanceLimit = null;

        App.sendSMS(this.phoneNumber, msg.data);
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

        App.sendSMS(this.phoneNumber, msg.data);
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

        App.sendSMS(this.phoneNumber, msg.data);
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

        App.sendSMS(this.phoneNumber, msg.data);
    }

    /**
     * Request a list of the SOS numbers registered on the device.
     */
    public listSOSNumbers() {
        let msg = new TrackerMessage(MessageDirection.SENT);
        msg.type = MessageType.COMMAND;
        msg.data = 'C10#';

        App.sendSMS(this.phoneNumber, msg.data);
    }
}
