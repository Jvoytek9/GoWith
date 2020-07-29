import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MotionAnalysisPageRoutingModule } from './motion-analysis-routing.module';

import { MotionAnalysisPage } from './motion-analysis.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MotionAnalysisPageRoutingModule
  ],
  declarations: [MotionAnalysisPage]
})
export class MotionAnalysisPageModule {}
