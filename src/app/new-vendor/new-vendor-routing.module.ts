import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewVendorPage } from './new-vendor.page';

const routes: Routes = [
  {
    path: '',
    component: NewVendorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewVendorPageRoutingModule {}
