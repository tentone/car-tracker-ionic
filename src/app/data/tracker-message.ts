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
