import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';
import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {AppRouterModule} from './app.router.module';
import {AppComponent} from './app.component';
import {TranslateModule} from '@ngx-translate/core';
import {ScreensModule} from './screens/screens.module';
import {SMS} from '@ionic-native/sms/ngx';
import {AndroidPermissions} from '@ionic-native/android-permissions/ngx';
import {Geolocation} from '@ionic-native/geolocation/ngx';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    TranslateModule.forRoot(),
    IonicModule.forRoot({
      mode: 'md',
      animated: true,
      rippleEffect: true,
      hardwareBackButton: true,
      statusTap: false,
      swipeBackEnabled: false
    }),
    AppRouterModule,
    ScreensModule
  ],
  providers: [
    SMS,
    Geolocation,
    AndroidPermissions,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
