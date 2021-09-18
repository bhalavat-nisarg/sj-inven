import { Component, OnInit } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { NavController } from '@ionic/angular';

import * as Firebase from 'firebase/app';

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.page.html',
  styleUrls: ['./suppliers.page.scss'],
})
export class SuppliersPage implements OnInit {
  suppliers = [
    {
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
    },
  ];

  firebase = Firebase.default;

  constructor(private navCtrl: NavController) {}

  async ngOnInit() {
    // (
    //   await this.loadingCtrl.create({
    //     message: 'Please Wait..',
    //     duration: 5000,
    //   })
    // ).present();

    this.suppliers = [];
    // this.loadDummy();
    this.getSuppliers();
  }

  toVendor(supplier: any) {
    const navigateExtras: NavigationExtras = {
      state: {
        vendor: supplier,
        source: 'supplier',
      },
    };

    this.navCtrl.navigateForward('/vendor', navigateExtras);
  }

  async getSuppliers() {
    await this.firebase
      .firestore()
      .collection('vendors')
      .where('vendorType', '==', 'supplier')
      .orderBy('vendorName')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((docRecords) => {
          this.suppliers.push({
            vendorId: docRecords.get('vendorId'),
            vendorName: docRecords.get('vendorName'),
            address1: docRecords.get('address1'),
            address2: docRecords.get('address2'),
            address3: docRecords.get('address3'),
            city: docRecords.get('city'),
            state: docRecords.get('state'),
            country: docRecords.get('country'),
            pincode: docRecords.get('pincode'),
            description: docRecords.get('description'),
            status: docRecords.get('status'),
            mobile: docRecords.get('mobile'),
            email: docRecords.get('email'),
            gst: docRecords.get('gst'),
            createdBy: docRecords.get('createdBy'),
            createDate: docRecords.get('createDate'),
            lastUpdateDate: docRecords.get('lastUpdateDate'),
            lastUpdatedBy: docRecords.get('lastUpdatedBy'),
          });
        });
      })
      .catch((error) => console.log(error));
  }

  addNewSuppliers() {
    const navigateExtras: NavigationExtras = {
      state: {
        source: 'supplier',
        editMode: false,
      },
    };

    this.navCtrl.navigateForward('/new-vendor', navigateExtras);
  }

  loadDummy() {
    this.suppliers = [
      {
        vendorId: 10001,
        vendorName: 'Dummy Supplier',
        address1: '1, Chamber Line',
        address2: '',
        address3: '',
        city: 'Vadodara',
        state: 'Gujarat',
        country: 'India',
        pincode: '390019',
        status: 'Active',
        mobile: '9876543210',
        email: 'info@dummy.com',
        gst: '',
        description: '',
        createdBy: '-1',
        createDate: '1 Aug 2021',
        lastUpdateDate: '-1',
        lastUpdatedBy: '1 Aug 2021',
      },
    ];
  }
}
