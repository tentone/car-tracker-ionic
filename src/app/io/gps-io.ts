import {App} from '../app';
import { Plugins } from '@capacitor/core';
const {Geolocation} = Plugins;

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
    public static async getPosition(onSuccess: Function, onError?: Function) {
        if (App.isMobile()) {
            // TODO <GET POSITION>
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
        Geolocation.watchPosition({}, (position, err) => {

        });
        // TODO <WATCH GPS POSITION CONINOUSLY>
        /*// Watch for changes in the GPS position
        let watch = App.geolocation.watchPosition();
        watch.subscribe((data) => {
            onChange(data.coords.longitude, data.coords.latitude);
        });*/
    }
}
