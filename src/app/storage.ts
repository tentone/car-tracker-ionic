import {Tracker} from './data/tracker';
import {Settings} from './data/settings';

/**
 * The storage class is used to access and store all persistent data used in the application.
 *
 * This data is stored in the device and can be export as a file for device migration.
 */
export class Storage {
	/**
	 * Application general settings.
	 */
	public static settings: Settings;

	/**
	 * List of the trackers stored in the application.
	 */
	public static trackers: Tracker[];


}
