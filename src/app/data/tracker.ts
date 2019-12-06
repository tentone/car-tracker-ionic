import {UUIDUtils} from '../utils/uuid-utils';

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
     */
    public pin: string;

    constructor() {
        this.uuid = UUIDUtils.generate();
    }

}
