import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {TabsPage} from './screens/tabs/tabs.page';
import {TrackersPage} from './screens/trackers/trackers.page';
import {MapPage} from './screens/map/map.page';
import {SettingsPage} from './screens/settings/settings.page';

export const AppRoutes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'trackers',
        children: [
          {
            path: '',
            component: TrackersPage
          }
        ]
      },
      {
        path: 'map',
        children: [
          {
            path: '',
            component: MapPage
          }
        ]
      },
      {
        path: 'settings',
        children: [
          {
            path: '',
            component: SettingsPage
          }
        ]
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
