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
    public static async getPosition(): Promise<Position> {
        if (App.isMobile()) {
            App.androidPermissions.requestPermission(App.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION).then(() => {
               return App.geolocation.getCurrentPosition();
            });
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
    public static setWatcher(onChange: (position: Position) => void) {
        if (App.isMobile()) {
            // Watch for changes in the GPS position
            let watch = App.geolocation.watchPosition();
            watch.subscribe((data: Position) => {
                onChange(data);
            });
        } else if (navigator.geolocation) {
            navigator.geolocation.watchPosition(onChange);
        }
    }
}
