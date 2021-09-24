import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { LoadingController, NavController } from '@ionic/angular';

import * as Firebase from 'firebase/app';
import 'firebase/firestore';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.page.html',
  styleUrls: ['./customers.page.scss'],
})
export class CustomersPage implements OnInit {
  customers = [
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
  source = 'new';
  searchBar: any;
  items: any;

  constructor(
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.queryParams.subscribe(() => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.source = this.router.getCurrentNavigation().extras.state.source;
      }
    });
    if (this.source === 'new-vendor' || this.source === 'new') {
      this.customers = [];
      this.getCustomers();
    }
  }

  async ngOnInit() {
    (
      await this.loadingCtrl.create({
        message: 'Please Wait..',
        duration: 3000,
      })
    ).present();

    this.searchBar = document.querySelector('ion-searchbar');
    this.searchBar.addEventListener('ionInput', this.handleInput);

    // this.loadDummy();
  }
  async refresh() {
    (
      await this.loadingCtrl.create({
        message: 'Please Wait..',
        duration: 3000,
      })
    ).present();
    this.customers = [];
    this.getCustomers();
  }

  async getCustomers() {
    await this.firebase
      .firestore()
      .collection('vendors')
      .where('vendorType', '==', 'customer')
      .orderBy('vendorName')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((docRecords) => {
          this.customers.push({
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

  addNewCustomers() {
    const navigateExtras: NavigationExtras = {
      state: {
        source: 'customer',
        editMode: false,
      },
    };

    this.navCtrl.navigateForward('/new-vendor', navigateExtras);
  }

  toVendor(customer: any) {
    const navigateExtras: NavigationExtras = {
      state: {
        vendor: customer,
        source: 'customer',
      },
    };

    this.navCtrl.navigateForward('/vendor', navigateExtras);
  }

  loadDummy() {
    this.customers = [
      {
        vendorId: 10001,
        vendorName: 'Dummy Customer',
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

  handleInput(event) {
    this.items = Array.from(document.querySelectorAll('.custList'));
    const query = event.srcElement.value.toLowerCase();

    requestAnimationFrame(() => {
      this.items.forEach((item) => {
        const shouldShow = item.textContent.toLowerCase().indexOf(query) > -1;
        item.style.display = shouldShow ? 'block' : 'none';
      }, this);
    });
  }
}
