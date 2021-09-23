import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PropertyNewPageRoutingModule } from './property-new-routing.module';

import { PropertyNewPage } from './property-new.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PropertyNewPageRoutingModule
  ],
  declarations: [PropertyNewPage]
})
export class PropertyNewPageModule {}
