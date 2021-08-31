import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PolygonDrawerPageRoutingModule } from './polygon-drawer-routing.module';

import { PolygonDrawerPage } from './polygon-drawer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PolygonDrawerPageRoutingModule
  ],
  declarations: [PolygonDrawerPage]
})
export class PolygonDrawerPageModule {}
