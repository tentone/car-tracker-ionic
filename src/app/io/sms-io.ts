/**
 * Handles the mobile SMS IO, used to send and receive SMS.
 *
 * Also handles mock data environment for browser testing.
 */
export class SmsIo {
	/**
	 * Method used to process SMS received, received the message text and the number of the sender.
	 * 
	 * Booth parameters are string.
	 */
	public static onReceive: Function;

}
