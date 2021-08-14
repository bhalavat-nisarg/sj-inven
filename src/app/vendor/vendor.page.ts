import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.page.html',
  styleUrls: ['./vendor.page.scss'],
})
export class VendorPage implements OnInit {
  vendor = {
    vendorId: 0,
    vendorName: '',
    address1: '',
    address2: '',
    address3: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
    description: '',
    status: '',
    createdBy: '',
    createDate: '',
    lastUpdateDate: '',
    lastUpdatedBy: '',
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private navCtrl: NavController
  ) {
    this.route.queryParams.subscribe(() => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.vendor = this.router.getCurrentNavigation().extras.state.vendor;
      }
    });
  }

  ngOnInit() {
    console.log(this.vendor);
  }

  closeVendor() {}
}
