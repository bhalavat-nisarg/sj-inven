import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PrintingPageRoutingModule } from './printing-routing.module';

import { PrintingPage } from './printing.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PrintingPageRoutingModule
  ],
  declarations: [PrintingPage]
})
export class PrintingPageModule {}
