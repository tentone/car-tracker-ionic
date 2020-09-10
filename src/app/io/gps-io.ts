import {App} from '../app';

/**
 * Handles access to the GPS information, booth for mobile devices and the browser.
 */
export class GpsIo {
    /**
     * Get position from GPS or browser location API.
     *
     * @return Promise withe the current position of the device.
     */
    public static async getPosition(): Promise<GeolocationPosition> {
        if (App.isMobile()) {
            return Geolocation.getCurrentPosition({enableHighAccuracy: true});
        } else if (navigator.geolocation) {
            return new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition((data: Position) => {
                    resolve(data);
                }, (err: PositionError) => {
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
            Geolocation.watchPosition({enableHighAccuracy: true}, (position: GeolocationPosition, err: any) => {
                onChange(position);
            });
        } else if (navigator.geolocation) {
            navigator.geolocation.watchPosition(onChange);
        }
    }
}
