import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy, RouterModule} from '@angular/router';
import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {AppRouterModule} from './app.router.module';
import {AppComponent} from './app.component';
import {TranslateModule} from '@ngx-translate/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {TabsPage} from './screens/tabs/tabs.page';
import {TrackersPage} from './screens/trackers/trackers.page';
import {TrackerAddPage} from './screens/trackers/add/tracker-add.page';
import {MapPage} from './screens/map/map.page';
import {SettingsPage} from './screens/settings/settings.page';
import {FormObjectComponent} from './components/form-object/form-object.component';
import {TrackerViewPage} from './screens/trackers/view/tracker-view.page';
import {TrackerLogsPage} from './screens/trackers/logs/tracker-logs.page';
import {AppHeaderComponent} from './components/app-header/app-header.component';
import {FormatDatePipe} from './screens/pipes';
import {GpsMapComponent} from './components/gps-map/gps-map.component';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { SMS } from '@ionic-native/sms/ngx';
import { Contacts } from '@ionic-native/contacts/ngx';
import { File } from '@ionic-native/file/ngx';
import { Chooser } from '@ionic-native/chooser/ngx';

@NgModule({
    declarations: [
        // Pages
        AppComponent,
        TabsPage,
        TrackersPage,
        TrackerAddPage,
        TrackerViewPage,
        TrackerLogsPage,
        MapPage,
        SettingsPage,
        // Components
        AppHeaderComponent,
        FormObjectComponent,
        FormatDatePipe,
        GpsMapComponent
    ],
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
    IonicModule,
    CommonModule,
    FormsModule,
    TranslateModule,
    RouterModule
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    AndroidPermissions,
    SMS,
    Contacts,
    File,
    Chooser
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
