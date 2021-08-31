import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PolygonDrawerPage } from './polygon-drawer.page';

const routes: Routes = [
  {
    path: '',
    component: PolygonDrawerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PolygonDrawerPageRoutingModule {}
