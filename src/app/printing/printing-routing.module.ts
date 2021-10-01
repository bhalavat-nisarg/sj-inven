import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PrintingPage } from './printing.page';

const routes: Routes = [
  {
    path: '',
    component: PrintingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrintingPageRoutingModule {}
