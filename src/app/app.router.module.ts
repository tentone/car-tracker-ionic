import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {TabsPage} from './screens/tabs/tabs.page';
import {TrackersPage} from './screens/tabs/trackers/trackers.page';
import {MapPage} from './screens/tabs/map/map.page';
import {SettingsPage} from './screens/tabs/settings/settings.page';
import {TrackerAddPage} from './screens/tabs/trackers/add/tracker-add.page';
import {TrackerViewPage} from './screens/tabs/trackers/view/tracker-view.page';
import {TrackerLogsPage} from './screens/tabs/trackers/logs/tracker-logs.page';

export const AppRoutes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'trackers',
        component: TrackersPage
      },
      {
        path: 'trackers/add',
        component: TrackerAddPage
      },
      {
        path: 'trackers/view',
        component: TrackerViewPage
      },
      {
        path: 'trackers/logs',
        component: TrackerLogsPage
      },
      {
        path: 'map',
        component: MapPage
      },
      {
        path: 'settings',
        component: SettingsPage
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/trackers',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(AppRoutes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRouterModule {}
