import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';

import * as Firebase from 'firebase/app';
import 'firebase/firestore';

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

  firebase = Firebase.default;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private alertCtrl: AlertController
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
    //this.loadDummy();
    this.btnClick = false;
  }

  async closeVendor() {
    if (this.source === 'supplier') {
      this.navCtrl.navigateBack('/suppliers');
    } else if (this.source === 'customer') {
      this.navCtrl.navigateBack('/customers');
    } else {
      this.navCtrl.navigateRoot('/home');
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

  async toggleStatus() {
    this.btnClick = true;
    if (this.vendor.status === 'Active') {
      (
        await this.alertCtrl.create({
          header: 'Confirm Action',
          subHeader:
            'Are you sure you want to disable this' + this.source + '?',
          buttons: [
            {
              text: 'cancel',
              role: 'cancel',
            },
            {
              text: 'okay',
              role: 'submit',
              handler: () => {
                this.vendor.status = 'Inactive';
                this.toggleFirebase('Inactive');
              },
            },
          ],
        })
      ).present();
    } else if (this.vendor.status === 'Inactive') {
      this.vendor.status = 'Active';
      this.toggleFirebase('Active');
    }
  }

  async toggleFirebase(statusVal: string) {
    let docId: string;
    await this.firebase
      .firestore()
      .collection('vendors')
      .where('vendorId', '==', this.vendor.vendorId)
      .get()
      .then((querySnap) => {
        querySnap.forEach((doc) => {
          docId = doc.id;
          console.log(doc.id);
        });
      })
      .catch((error) => console.log(error));

    await this.firebase
      .firestore()
      .collection('vendors')
      .doc(docId)
      .update({
        status: statusVal,
      })
      .catch((error) => console.log(error));
  }
}
