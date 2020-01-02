import {Platform} from '@ionic/angular';
import {Router} from '@angular/router';
import {Navigation} from './navigation';
import {Settings} from './data/settings';
import {Tracker} from './data/tracker';
import {LocalStorage} from './utils/local-storage';
import * as mapboxgl from 'mapbox-gl';
import {Environment} from '../environments/environment';
import {SMS, SmsOptions} from '@ionic-native/sms/ngx';
import {AndroidPermissions} from '@ionic-native/android-permissions/ngx';
import {Contacts} from '@ionic-native/contacts/ngx';

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

    public static androidPermissions: AndroidPermissions;
    public static sms: SMS;
    public static contacts: Contacts;

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
     * @param androidPermissions
     * @param sms
     * @param contacts
     */
    public static initialize(platform: Platform, router: Router, androidPermissions: AndroidPermissions, sms: SMS, contacts: Contacts) {
        // @ts-ignore
        mapboxgl.accessToken = Environment.mapbox;

        this.navigator = new Navigation(router);
        this.platform = platform;
        this.androidPermissions = androidPermissions;
        this.sms = sms;
        this.contacts = contacts;

        this.load();
        
        setTimeout(() => {
            // @ts-ignore
            if (window.SMSReceive !== undefined) {
                // @ts-ignore
                window.SMSReceive.startWatch(() => {
                    console.log('CarTracker: SMS Receiver watching started.');
                }, () => {
                    alert('CarTracker: Failed to start SMS watching.');
                });
            } else {
                alert('CarTracker: SMSReceive undefined.');
            }

            // SMS Received event
            document.addEventListener('onSMSArrive', function(e: any) {
                console.log('onSMSArrive()', e, e.data);
            });
        }, 1000);

    }

    /**
     * Stop the SMS receiver watcher.
     */
    public static stopSMSReceiver() {
        // @ts-ignore
        if (window.SMSReceive !== undefined) {
            // @ts-ignore
            window.SMSReceive.stopWatch(() => {
                console.log('CarTracker: SMS Receiver watching stopped.');
            });
        }
    }

    /**
     * Send SMS to phone number.
     *
     * @param phoneNumber Destination phone number.
     * @param message Message content
     * @param onSuccess OnSuccess optional callback function.
     * @param onError OnError optional callback function.
     */
    public static sendSMS(phoneNumber: string, message: string, onSuccess?: Function, onError?: Function) {
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.SEND_SMS).then(() => {
            let options: SmsOptions = {
                replaceLineBreaks: false,
                android: {
                    intent: ''
                }
            };

            if (this.sms.hasPermission()) {
                this.sms.send(phoneNumber, message, options).then(() => {
                    if (onSuccess !== undefined) {
                        onSuccess();
                    }
                }).catch(() => {
                    if (onError !== undefined) {
                        onError();
                    }
                });
            }
        });
    }

    /**
     * Load data from the local storage.
     */
    public static load() {
        this.settings = LocalStorage.get('settings');
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

        this.trackers = LocalStorage.get('trackers');
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

        console.log('CarTracker: Loaded data from storage.', this.trackers, this.settings);
    }

    /**
     * Store data into the local storage.
     */
    public static store() {
        LocalStorage.set('settings', this.settings);
        LocalStorage.set('trackers', this.trackers);

        console.log('CarTracker: Saved data into storage.', this.trackers, this.settings);
    }
}
