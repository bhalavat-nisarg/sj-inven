import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InvoiceHeaderPageRoutingModule } from './invoice-header-routing.module';

import { InvoiceHeaderPage } from './invoice-header.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InvoiceHeaderPageRoutingModule
  ],
  declarations: [InvoiceHeaderPage]
})
export class InvoiceHeaderPageModule {}
