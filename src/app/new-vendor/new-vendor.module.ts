import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewVendorPageRoutingModule } from './new-vendor-routing.module';

import { NewVendorPage } from './new-vendor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewVendorPageRoutingModule
  ],
  declarations: [NewVendorPage]
})
export class NewVendorPageModule {}
