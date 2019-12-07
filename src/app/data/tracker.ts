import {UUIDUtils} from '../utils/uuid-utils';

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
    public number: string;

    /**
     * PIN number of the tracker used for authentication.
     *
     * Usually it is a 4 digit numeric pin.
     */
    public pin: string;

    /**
     * Indicates if the tracker is active and should be displayed on the map.
     */
    public active: boolean;

    constructor() {
        this.uuid = UUIDUtils.generate();
        this.active = true;
        this.name = '';
        this.number = '';
        this.pin = '';
        this.color = '';
    }

    public setSMSMode() {
        let msg: string = '700' + this.pin;
        // TODO <ADD CODE HERE>
    }

    public changePIN(newPin: number) {
        let msg: string = '777' + this.pin + newPin;
        // TODO <ADD CODE HERE>
    }

    public rconf() {
        let msg: string = 'RCONF';
        // TODO <ADD CODE HERE>
    }

}
