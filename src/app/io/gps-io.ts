import {Modal} from '../screens/modal';
import {Locale} from '../locale/locale';
import {App} from '../app';

/**
 * Handles access to the GPS information, booth for mobile devices and the browser.
 */
export class GpsIo {
    /**
     * Get position from GPS or browser location API.
     */
    public getPosition(onSuccess: Function, onError?: Function) {
        if (window.cordova) {
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

    public setWatcher(onChange: Function) {
        // Watch for changes in the GPS position
        let watch = App.geolocation.watchPosition();
        watch.subscribe((data) => {
           //  this.setMarker(data.coords.longitude, data.coords.latitude, false);
        });
    }
}
