import {Platform} from '@ionic/angular';
import {Router} from '@angular/router';
import {Navigation} from './navigation';
import {Settings} from './data/settings';
import {Tracker} from './data/tracker';
import {LocalStorage} from './utils/local-storage';
import * as mapboxgl from 'mapbox-gl';
import {Environment} from '../environments/environment';
import {SmsIo} from './io/sms-io';
import {Themes} from './theme';
// import {smsreader} from 'cordova-sms-reader';

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

        SmsIo.startListener((message: string, phoneNumber: string) => {
            for (let i = 0; i < App.trackers.length; i++) {
                if (App.trackers[i].phoneNumber === phoneNumber) {
                    console.log('CarTracker: Received data for tracker.', App.trackers[i]);
                    App.trackers[i].processSMS(message);
                }
            }

            App.store();
        });
    }

    /**
     * Load data from the local storage.
     */
    public static load() {
        this.settings = LocalStorage.get('settings');
        this.trackers = LocalStorage.get('trackers');

        // console.log('CarTracker: Loaded data from storage.', this.trackers, this.settings);

        if (this.settings === null) {
            this.settings = new Settings();
        } else {
          let settings = new Settings();
          for (let i in settings) {
              if (this.settings[i] === undefined) {
                 this.settings[i] = settings[i];
              }
          }
        }

        Themes.setTheme(this.settings.theme);

        if (this.trackers === null) {
            this.trackers = [];
        } else {
            for (let j = 0; j < this.trackers.length; j++) {
                let tracker = new Tracker();
                for (let i in tracker) {
                    tracker[i] = this.trackers[j][i];
                }
                this.trackers[j] = tracker;
            }
        }
    }

    /**
     * Store data into the local storage.
     */
    public static store() {
        LocalStorage.set('settings', this.settings);
        LocalStorage.set('trackers', this.trackers);

        console.log('CarTracker: Saved data into storage.', this.trackers, this.settings);
    }

    /**
     * Check if the application is running on a mobile device.
     */
    public static isMobile(): boolean {
        // @ts-ignore
        return window.cordova !== undefined;
    }
}
