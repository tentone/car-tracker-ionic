import {GPSPosition} from '../gps-position';

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
        this.data = null;
    }
}

/**
 * location message data. Received every time that the position of the tracker is requested.
 *
 * Sometimes the position of the tracker may be unknown due to lack of GPS signal or sleep mode being active.
 */
export class LocationData {
    public position: GPSPosition = null;
    public id: string = '';
    public acc: boolean = false;
    public gps: boolean = false;
    public speed: number = 0;
    public date: Date = new Date();
}

/**
 * Tracker information and configuration data, has to be manually requested from the app.
 */
export class InformationData {
    public model: string = '';
    public id: string = '';
    public ip: string = '';
    public port: string = '';
    public battery: number = 0;
    public apn: string = '';
    public gps: string = '';
    public gsm: string = '';
    public iccid: string = '';
}

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
    SOS_NUMBERS: 4,
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
    [MessageType.SOS_NUMBERS, 'sosNumbers'],
    [MessageType.UNKNOWN, 'unknown']
]);
