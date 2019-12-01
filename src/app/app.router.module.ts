import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';

export const AppRoutes: Routes = [
  {
    path: '',
    loadChildren: () => import('./screens/tabs/tabs.module').then(m => m.TabsPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(AppRoutes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRouterModule {}
