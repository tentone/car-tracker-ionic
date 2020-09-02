import {Modal} from '../screens/modal';
import {Locale} from '../locale/locale';
import {App} from '../app';

/**
 * Handles access to the GPS information, booth for mobile devices and the browser.
 */
export class GpsIo {
    /**
     * Get position from GPS or browser location API.
     *
     * @param onSuccess Method called when the position is obtained receives (longitude, latitude).
     * @param onError Method called if an error occurs while getting the GPS position.
     */
    public static getPosition(onSuccess: Function, onError?: Function) {
        if (App.isMobile()) {
            App.androidPermissions.requestPermission(App.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION).then(() => {
                // Get the current position
                App.geolocation.getCurrentPosition().then((data) => {
                    onSuccess(data.coords.longitude, data.coords.latitude);
                }).catch((error) => {
                    Modal.alert(Locale.get('error'), Locale.get('errorLocation') + ' (' + error + ')');
                    console.warn('CarTracker: Error getting location.', error);
                });
            });
        } else if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((data) => {
                onSuccess(data.coords.longitude, data.coords.latitude);
            });
        }
    }

    /**
     * Set GPS change watcher method, called every time that the GPS position is changed.
     *
     * @param onChange Method called when the position changes receives (longitude, latitude).
     */
    public static setWatcher(onChange: Function) {
        // Watch for changes in the GPS position
        let watch = App.geolocation.watchPosition();
        watch.subscribe((data) => {
            // @ts-ignore
            onChange(data.coords.longitude, data.coords.latitude);
        });
    }
}
