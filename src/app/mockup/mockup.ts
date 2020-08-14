/**
 * Interface to device the functionality of a mockup device.
 */
export interface Mockup {
    /**
     * Method used to process to SMS received from the application.
     *
     * @param message Message to be sent to the application.
     * @param phoneNumber Origin phone number of the SMS message.
     */
    processSMS(message: string, phoneNumber: string);

    /**
     * Send message to the mock device.
     *
     * @param message Message content.
     * @param phoneNumber Destination phone number of the SMS.
     */
    sendSMS(message: string, phoneNumber: string);
}
