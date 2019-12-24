import {UUIDUtils} from '../utils/uuid-utils';
import {App} from '../app';

export const TrackerMessageDirection = {
    SENT: 1,
    RECEIVED: 2
};

export class TrackerMessage {
    public from: string;
    public direction: number;
    public message: string;
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
    public name: string;

    /**
     * Color to represent the tracker on the map.
     */
    public color: string;

    /**
     * Phone number of the tracker used to send and receive messages.
     */
    public phoneNumber: string;

    /**
     * PIN number of the tracker used for authentication.
     *
     * Usually it is a 4 digit numeric pin.
     */
    public pin: string;

    /**
     * Battery level, 5 is 100%, 1 is 20%; the battery is from 1 to 5.
     */
    public battery: number;

    /**
     * Indicates if the tracker is active and should be displayed on the map.
     */
    public active: boolean;

    constructor() {
        this.uuid = UUIDUtils.generate();
        this.active = true;
        this.name = '';
        this.phoneNumber = '';
        this.pin = '';
        this.color = null;
        this.battery = null;
    }

    public getLocation() {
        App.sendSMS(this.phoneNumber, 'g1234');
    }

    /**
     * Change the pin of the tracker.
     *
     * @param newPin New pin to be set on the tracker.
     */
    public changePIN(newPin: number) {
        App.sendSMS(this.phoneNumber, 'password' + this.pin + ' ' + newPin);
    }

    /**
     * Set admin number used for the admin related information.
     *
     * @param phoneNumber Phone number use for control.
     */
    public setAdminNumber(phoneNumber: string) {
        App.sendSMS(this.phoneNumber, 'admin' + this.pin + ' ' + phoneNumber);
    }

    /**
     * Set sos number used for the GPS to return requested information, alarm messages etc.
     *
     * @param phoneNumber Phone number use for control.
     * @param slot Slot being set can be 1, 2 or 3.
     */
    public setSOSNumber(phoneNumber: string, slot: number) {
        if (slot < 1 || slot > 3) {
           throw new Error('Invalid control number slot.');
        }

        App.sendSMS(this.phoneNumber, '10' + slot + '#' + phoneNumber + '#');
    }
}
