import {Platform} from '@ionic/angular';
import {Router} from '@angular/router';
import {Navigation} from './navigation';
import {Settings} from './data/settings';
import {MessageDirection, MessageType, Tracker, TrackerMessage} from './data/tracker';
import {LocalStorage} from './utils/local-storage';
import * as mapboxgl from 'mapbox-gl';
import {Environment} from '../environments/environment';
import {SMS, SmsOptions} from '@ionic-native/sms/ngx';
import {AndroidPermissions} from '@ionic-native/android-permissions/ngx';
import {Contacts} from '@ionic-native/contacts/ngx';
import {File} from '@ionic-native/file/ngx';
import {Chooser} from '@ionic-native/chooser/ngx';
import {SmsIo} from './io/sms-io';

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
    public static file: File;
    public static chooser: Chooser;

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
     * @param androidPermissions Android permissions
     * @param sms SMS handler,
     * @param contacts Contact access.
     * @param file Mobile file access.
     * @param chooser Mobile file chooser,
     */
    public static initialize(platform: Platform, router: Router, androidPermissions: AndroidPermissions, sms: SMS, contacts: Contacts, file: File,  chooser: Chooser) {
        // @ts-ignore
        mapboxgl.accessToken = Environment.mapbox;

        this.navigator = new Navigation(router);
        this.platform = platform;
        this.androidPermissions = androidPermissions;
        this.sms = sms;
        this.contacts = contacts;
        this.file = file;
        this.chooser = chooser;

        this.load();

        SmsIo.startListener((e) => {
            for (let i = 0; i < App.trackers.length; i++) {
                if (App.trackers[i].phoneNumber === e.data.address) {
                    console.log('CarTracker: Received data for tracker.', App.trackers[i]);
                    App.trackers[i].messages.push(App.parseMessage(e.data, App.trackers[i]));
                }
            }

            App.store();
        });
    }

    /**
     * Parse a message received from SMS and store its result on a tracker message.
     *
     * @param data Event data received with the message.
     * @param tracker Tracker that sent this message.
     */
    public static parseMessage(data: any, tracker: Tracker): TrackerMessage {
        let msg = new TrackerMessage(MessageDirection.RECEIVED);
        msg.date = new Date(data.date_sent);

        // Acknowledge message
        if (data.body === 'admin ok' || data.body === 'apn ok' || data.body === 'password ok' || data.body === 'speed ok' || data.body === 'ok') {
            msg.data = data.body;
            msg.type = MessageType.ACKNOWLEDGE;
            return msg;
        }

        // List of SOS numbers
        if (data.body.startsWith('101#')) {
            console.log('CarTracker: Received list of SOS numbers.', data);
            let numbers = data.body.split(' ');
            for (let i = 0; i < numbers.length;  i++) {
                tracker.sosNumbers[i] = numbers[i].substr(4);
            }
        }

        // Multiline messages
        let fields = data.body.split('\n');

        // Location message
        if (fields.length === 6) {
            try {
                let url = fields[0];
                msg.data = {
                    coords: null,
                    // tslint:disable-next-line:radix
                    id: Number.parseInt(fields[1].split(':')[1]),
                    acc: fields[2].split(':')[1] !== 'OFF',
                    gps: fields[3].split(':')[1] === 'A',
                    speed: Number.parseFloat(fields[4].split(':')[1]),
                    date: fields[5]
                };
                return msg;
            } catch (e) {}
        }
        // Information message
        if (fields.length === 8) {
            try {
                msg.data = {
                    model: fields[0],
                    id: fields[1].split(':')[1],
                    ip: fields[2].split(':')[1],
                    battery: Number.parseInt(fields[3].split(':')[1], 10),
                    apn: fields[4].split(':')[1],
                    gps: fields[5].split(':')[1],
                    gsm: fields[6].split(':')[1],
                    iccid: fields[7].split(':')[1],
                };
                return msg;
            } catch (e) {}
        }

        msg.data = data.body;
        msg.type = MessageType.UNKNOWN;
        return msg;
    }

    /**
     * Load data from the local storage.
     */
    public static load() {
        this.settings = LocalStorage.get('settings');
        this.trackers = LocalStorage.get('trackers');

        console.log('CarTracker: Loaded data from storage.', this.trackers, this.settings);

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
}
