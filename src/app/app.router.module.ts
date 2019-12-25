import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {TabsPage} from './screens/tabs/tabs.page';
import {TrackersPage} from './screens/tabs/trackers/trackers.page';
import {MapPage} from './screens/tabs/map/map.page';
import {SettingsPage} from './screens/tabs/settings/settings.page';
import {TrackersAddPage} from './screens/tabs/trackers/add/trackers-add.page';
import {TrackersViewPage} from './screens/tabs/trackers/view/trackers-view.page';

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
        component: TrackersAddPage
      },
      {
        path: 'trackers/view',
        component: TrackersViewPage
      },
      {
        path: 'map',
        component: MapPage
      },
      {
        path: 'settings',
        component: SettingsPage
      },
      {
        path: '',
        redirectTo: '/tabs/trackers',
        pathMatch: 'full'
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
