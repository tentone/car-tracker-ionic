import {Platform} from '@ionic/angular';
import {Router} from '@angular/router';
import {Navigation} from './navigation';
import {Settings} from './data/settings';
import {Tracker} from './data/tracker';
import {LocalStorage} from './utils/local-storage';
import * as mapboxgl from 'mapbox-gl';
import {Environment} from '../environments/environment';

/**
 * The app class is used to access and store all persistent data used in the application.
 *
 * This data is stored in the device and can be export as a file for device migration.
 */
export class App {
    /**
     * Used to access platform related metadata.
     */
    public static platform: Platform;

    /**
     * Router object used trough the hole page.
     */
    public static navigator: Navigation;

    /**
     * Application general settings.
     */
    public static settings: Settings;

    /**
     * List of the trackers stored in the application.
     */
    public static trackers: Tracker[];

    /**
     * Initialize the App class data.
     *
     * @param platform Platform object created from the app root.
     * @param router Router object created from the app root.
     */
    public static initialize(platform: Platform, router: Router) {
        // @ts-ignore
        mapboxgl.accessToken = Environment.mapbox;

        this.navigator = new Navigation(router);
        this.platform = platform;

        this.load();
    }

    /**
     * Load data from the local storage.
     */
    public static load() {
        this.settings = LocalStorage.get('settings');
        if (this.settings === null) {
            this.settings = new Settings();
        }

        this.trackers = LocalStorage.get('trackers');
        if (this.trackers === null) {
            this.trackers = [];
        }
    }

    /**
     * Store data into the local storage.
     */
    public static store() {
        LocalStorage.set('settings', this.settings);
        LocalStorage.set('trackers', this.trackers);
    }
}
