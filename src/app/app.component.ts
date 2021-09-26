import {Component, ViewEncapsulation} from '@angular/core';
import {Platform} from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';
import {Locale} from './locale/locale';
import {App} from './app';
import {Router} from '@angular/router';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {AndroidPermissions} from '@ionic-native/android-permissions/ngx';
import {Contacts} from '@ionic-native/contacts/ngx';
import {SMS} from '@ionic-native/sms/ngx';
import {File} from '@ionic-native/file/ngx';
import {Chooser} from '@ionic-native/chooser/ngx';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {Plugins} from '@capacitor/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    '../../node_modules/mapbox-gl/dist/mapbox-gl.css'
  ]
})
export class AppComponent {
  constructor(public platform: Platform, public splashScreen: SplashScreen, public translate: TranslateService, public router: Router,
              public androidPermissions: AndroidPermissions, public sms: SMS, public contacts: Contacts, public file: File,
              public chooser: Chooser, public geolocation: Geolocation) {
    Locale.initialize(this.translate);
    App.initialize(this.platform, this.router, androidPermissions, sms, contacts, file, chooser, geolocation);

    this.platform.ready().then(() => {
      this.splashScreen.hide();
    });
  }

}