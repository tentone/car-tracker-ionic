import {Component, ViewEncapsulation} from '@angular/core';
import {Platform} from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';
import {Locale} from './locale/locale';
import {App} from './app';
import {Router} from '@angular/router';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {SmsRetriever} from '@ionic-native/sms-retriever/ngx';
import {AndroidPermissions} from '@ionic-native/android-permissions/ngx';
import {SMS} from '@ionic-native/sms/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    '../../node_modules/mapbox-gl/dist/mapbox-gl.css'
  ]
})
export class AppComponent {
  constructor(public platform: Platform, public splashScreen: SplashScreen, public translate: TranslateService, public router: Router, public androidPermissions: AndroidPermissions, public sms: SMS, public smsReceiver: SmsRetriever) {
    Locale.initialize(this.translate);
    App.initialize(this.platform, this.router, androidPermissions, sms, smsReceiver);

    this.platform.ready().then(() => {
      this.splashScreen.hide();
    });

    // TODO <REMOVE TEST CODE>
    // This function is to get hash string of APP when successfully generate hash of APP.
    this.smsReceiver.getAppHash().then((res: any) => console.log(res)).catch((error: any) => console.error(error));

    // This function start watching message arrive event and retrieve message text.
    // Returns a promise that resolves when retrieves SMS text or TIMEOUT after 5 min.
    this.smsReceiver.startWatching().then((res: any) => console.log(res)).catch((error: any) => console.error(error));
  }

}
