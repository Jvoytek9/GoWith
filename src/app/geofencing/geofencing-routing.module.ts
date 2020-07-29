import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GeofencingPage } from './geofencing.page';

const routes: Routes = [
  {
    path: '',
    component: GeofencingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GeofencingPageRoutingModule {}
