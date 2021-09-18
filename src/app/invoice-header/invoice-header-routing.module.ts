import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InvoiceHeaderPage } from './invoice-header.page';

const routes: Routes = [
  {
    path: '',
    component: InvoiceHeaderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InvoiceHeaderPageRoutingModule {}
