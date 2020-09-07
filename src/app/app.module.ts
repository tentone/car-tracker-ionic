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
import {TrackersPage} from './screens/tabs/trackers/trackers.page';
import {TrackerAddPage} from './screens/tabs/trackers/add/tracker-add.page';
import {MapPage} from './screens/tabs/map/map.page';
import {SettingsPage} from './screens/tabs/settings/settings.page';
import {FormObjectComponent} from './components/form-object/form-object.component';
import {TrackerViewPage} from './screens/tabs/trackers/view/tracker-view.page';
import {TrackerLogsPage} from './screens/tabs/trackers/logs/tracker-logs.page';
import {AppHeaderComponent} from './components/app-header/app-header.component';
import {FormatDatePipe} from './screens/pipes';
import {GpsMapComponent} from './components/gps-map/gps-map.component';

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
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
