import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MotionAnalysisPage } from './motion-analysis.page';

const routes: Routes = [
  {
    path: '',
    component: MotionAnalysisPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MotionAnalysisPageRoutingModule {}
