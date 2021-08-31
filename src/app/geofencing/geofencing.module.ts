import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GeofencingPageRoutingModule } from './geofencing-routing.module';

import { GeofencingPage } from './geofencing.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GeofencingPageRoutingModule
  ],
  declarations: [GeofencingPage]
})
export class GeofencingPageModule {}
