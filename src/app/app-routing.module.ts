import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'tests',
    pathMatch: 'full'
  },
  {
    path: 'tests',
    loadChildren: () => import('./geofencing/geofencing.module').then( m => m.GeofencingPageModule)
    //loadChildren: () => import('./time-to-gate/time-to-gate.module').then( m => m.TimeToGatePageModule)
    //loadChildren: () => import('./polygon-drawer/polygon-drawer.module').then( m => m.PolygonDrawerPageModule)
    //loadChildren: () => import('./motion-analysis/motion-analysis.module').then( m => m.MotionAnalysisPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
