import {Component, ViewEncapsulation} from '@angular/core';
import {Platform} from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';
import {Locale} from './locale/locale';
import {App} from './app';
import {Router} from '@angular/router';
import {registerWebPlugin} from "@capacitor/core";
import {SmsManager} from '@byteowls/capacitor-sms';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    '../../node_modules/mapbox-gl/dist/mapbox-gl.css'
  ]
})
export class AppComponent {
  public constructor(public platform: Platform, public translate: TranslateService, public router: Router) {
    registerWebPlugin(SmsManager);

    Locale.initialize(this.translate);
    App.initialize(this.platform, this.router);

    this.platform.ready();
  }

}
