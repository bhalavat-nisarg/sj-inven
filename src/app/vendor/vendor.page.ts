import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
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
    mobile: '',
    email: '',
    gst: '',
    createdBy: '',
    createDate: '',
    lastUpdateDate: '',
    lastUpdatedBy: '',
  };

  source: string;
  btnClick: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private navCtrl: NavController
  ) {
    this.route.queryParams.subscribe(() => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.vendor = this.router.getCurrentNavigation().extras.state.vendor;
        this.source = this.router.getCurrentNavigation().extras.state.source;
      }
    });
  }

  ngOnInit() {
    console.log(this.vendor);
    this.loadDummy();
    this.btnClick = false;
  }

  closeVendor() {
    if (this.btnClick === true) {
      // TODO: update status to DB
      if (this.source === 'suppliers') {
        this.navCtrl.navigateBack('/suppliers');
      } else if (this.source === 'customers') {
        this.navCtrl.navigateBack('/customers');
      } else {
        this.navCtrl.navigateRoot('/home');
      }
    } else {
      if (this.source === 'supplier') {
        this.navCtrl.navigateBack('/suppliers');
      } else if (this.source === 'customer') {
        this.navCtrl.navigateBack('/customers');
      } else {
        this.navCtrl.navigateRoot('/home');
      }
    }
  }

  loadDummy() {
    this.source = 'supplier';
    this.vendor = {
      vendorId: 10001,
      vendorName: 'Dummy Supplier',
      address1: '1, Chamber Line',
      address2: 'Near Nav Bar',
      address3: 'Opposite New Value',
      city: 'Vadodara',
      state: 'Gujarat',
      country: 'India',
      pincode: '390019',
      status: 'Active',
      mobile: '9876543210',
      email: 'info@dummy.com',
      gst: '',
      description:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. ' +
        'Lorem Ipsum has been the industry standard dummy text ever since the 1500s,' +
        'when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
      createdBy: '-1',
      createDate: '1 Aug 2021',
      lastUpdateDate: '-1',
      lastUpdatedBy: '1 Aug 2021',
    };
  }

  toggleStatus() {
    this.btnClick = true;
    if (this.vendor.status === 'Active') {
      this.vendor.status = 'Inactive';
    } else if (this.vendor.status === 'Inactive') {
      this.vendor.status = 'Active';
    }
  }
}
