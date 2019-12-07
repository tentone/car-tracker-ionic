import {Component, ViewEncapsulation} from '@angular/core';
import {Platform} from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';
import {Locale} from './locale/locale';
import {App} from './app';
import {Router} from '@angular/router';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {SmsRetriever} from '@ionic-native/sms-retriever/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    '../../node_modules/mapbox-gl/dist/mapbox-gl.css'
  ]
})
export class AppComponent {
  constructor(public platform: Platform, public splashScreen: SplashScreen, public translate: TranslateService, public router: Router, private smsRetriever: SmsRetriever) {
    Locale.initialize(this.translate);
    App.initialize(this.platform, this.router);

    this.platform.ready().then(() => {
      this.splashScreen.hide();
    });

    // This function is to get hash string of APP when successfully generate hash of APP.
    this.smsRetriever.getAppHash().then((res: any) => console.log(res)).catch((error: any) => console.error(error));

    // This function start watching message arrive event and retrieve message text.
    // Returns a promise that resolves when retrieves SMS text or TIMEOUT after 5 min.
    this.smsRetriever.startWatching().then((res: any) => console.log(res)).catch((error: any) => console.error(error));
  }

}
