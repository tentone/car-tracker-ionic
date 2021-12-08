import {App} from '../app';
import {Geolocation} from '@capacitor/geolocation';
import {Geoposition} from '../data/geoposition';

/**
 * Handles access to the GPS information, booth for mobile devices and the browser.
 */
export class GeolocationIo {
	/**
	 * Get position from GPS or browser location API.
	 *
	 * @return Promise withe the current position of the device.
	 */
	public static async getPosition(): Promise<Geoposition> {
		if (App.isMobile()) {
			await App.androidPermissions.requestPermission(App.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION);
			
			const coordinates = await Geolocation.getCurrentPosition();

			return new Geoposition(coordinates.coords.latitude, coordinates.coords.longitude, coordinates.coords.altitude);
		} else if (navigator.geolocation) {
			return new Promise((resolve, reject) => {
				navigator.geolocation.getCurrentPosition((data: GeolocationPosition) => {
					resolve(new Geoposition(data.coords.latitude, data.coords.longitude, data.coords.altitude));
				}, (err: GeolocationPositionError) => {
					reject(err);
				});
			});

		}
	}

	/**
	 * Set GPS change watcher method, called every time that the GPS position is changed.
	 *
	 * @param onChange Method called when the position changes receives the position of the device.
	 */
	public static async setWatcher(onChange: (position: Geoposition) => void) {
		if (App.isMobile()) {
			let watcher = await Geolocation.watchPosition({enableHighAccuracy: true}, (data: any) => {
				onChange(new Geoposition(data.coords.latitude, data.coords.longitude, data.coords.altitude));
			});
		} else if (navigator.geolocation) {
			navigator.geolocation.watchPosition(function (data: GeolocationPosition) {
				onChange(new Geoposition(data.coords.latitude, data.coords.longitude, data.coords.altitude));
			});
		}
	}
}
