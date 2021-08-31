import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TimeToGatePage } from './time-to-gate.page';

const routes: Routes = [
  {
    path: '',
    component: TimeToGatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TimeToGatePageRoutingModule {}
