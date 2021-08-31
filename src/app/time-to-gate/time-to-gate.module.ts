import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TimeToGatePageRoutingModule } from './time-to-gate-routing.module';

import { TimeToGatePage } from './time-to-gate.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TimeToGatePageRoutingModule
  ],
  declarations: [TimeToGatePage]
})
export class TimeToGatePageModule {}
