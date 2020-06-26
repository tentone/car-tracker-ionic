/**
 * Interface to device the functionality of a mockup device.
 */
export interface Mockup {
    respondSMS(message: string, phoneNumber: string);
    sendSMS(message: string, phoneNumber: string);
}
