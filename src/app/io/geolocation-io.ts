import {App} from '../app';
import {Geolocation} from '@capacitor/geolocation';

/**
 * Handles access to the GPS information, booth for mobile devices and the browser.
 */
export class GeolocationIo {
    /**
     * Get position from GPS or browser location API.
     *
     * @return Promise withe the current position of the device.
     */
    public static async getPosition(): Promise<GeolocationPosition> {
        if (App.isMobile()) {
            await App.androidPermissions.requestPermission(App.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION);
            const coordinates = await Geolocation.getCurrentPosition();

            console.log('Current position:', coordinates);
            alert(coordinates);

        } else if (navigator.geolocation) {
            return new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition((data: GeolocationPosition) => {
                    resolve(data);
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
    public static setWatcher(onChange: (position: GeolocationPosition) => void) {
        if (App.isMobile()) {
            // Watch for changes in the GPS position
            let watch = Geolocation.watchPosition({enableHighAccuracy: true}, (data: any) => {
                onChange(data);
            });
        } else if (navigator.geolocation) {
            navigator.geolocation.watchPosition(onChange);
        }
    }
}
