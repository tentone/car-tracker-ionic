import {SmsOptions} from '@ionic-native/sms/ngx';
import {App} from '../app';
import {Mockup} from '../mockup/mockup';
import {Gt901Mockup} from '../mockup/gt-901-mockup';

/**
 * Handles the mobile SMS IO, used to send and receive SMS.
 *
 * Also handles mock data environment for browser testing.
 */
export class SmsIo {
	/**
	 * Mockup object used to fake communication when running on development under a browser.
	 */
	public static mockup: Mockup = null;

	/**
	 * Method used to process SMS received, receives the parameters (message, phoneNumber).
	 */
	public static onReceive: (message: string, phoneNumber: string) => void = null;

	/**
	 * Start SMS listener.
	 *
	 * @param onReceive On receive callback used to process SMS received.
	 */
	public static startListener(onReceive?: (message: string, address: string) => void) {
		if (onReceive !== undefined) {
			this.onReceive = onReceive;
		}

		if (App.isMobile()) {
			// TODO <LISTEN TO SMS RECEIVED>
		} else {
			this.mockup = new Gt901Mockup(this.onReceive);
		}
	}

	/**
	 * Stop the SMS receiver watcher, should be stopped when exiting the application to prevent leaks.
	 */
	public static stopListener() {
		if (App.isMobile()) {
			// TODO <STOP LISTENING TO SMS RECEIVED>
		}
	}

	/**
	 * Send SMS to phone number.
	 *
	 * @param phoneNumber Destination phone number.
	 * @param message Message content
	 * @param onSuccess OnSuccess optional callback function.
	 * @param onError OnError optional callback function.
	 */
	public static sendSMS(phoneNumber: string, message: string, onSuccess?: Function, onError?: Function) {
		if (App.isMobile()) {
			// TODO <SEND SMS>
		} else {
			this.mockup.sendSMS(message, phoneNumber);

			if (onSuccess !== undefined) {
				onSuccess();
			}
		}
	}

}
