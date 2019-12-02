import {IonicModule} from '@ionic/angular';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {RouterModule} from '@angular/router';
import {TabsPage} from './tabs/tabs.page';
import {TrackersPage} from './tabs/trackers/trackers.page';
import {MapPage} from './tabs/map/map.page';
import {SettingsPage} from './tabs/settings/settings.page';
import {TestPage} from './tabs/test/test.page';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        TranslateModule,
        RouterModule
    ],
    declarations: [
        TabsPage,
        TrackersPage,
        MapPage,
        TestPage,
        SettingsPage
    ]
})
export class ScreensModule { }
