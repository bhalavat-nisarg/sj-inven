import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import * as axiosMain from 'axios';

import * as Firebase from 'firebase/app';
import 'firebase/firestore';

@Component({
  selector: 'app-new-vendor',
  templateUrl: './new-vendor.page.html',
  styleUrls: ['./new-vendor.page.scss'],
})
export class NewVendorPage implements OnInit {
  inVendor = {
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
    status: 'Active',
    mobile: '',
    email: '',
    gst: '',
  };

  govPincode = [
    {
      block: '',
      branchType: '',
      circle: '',
      country: '',
      deliveryStatus: '',
      description: '',
      district: '',
      division: '',
      name: '',
      pincode: '',
      region: '',
      state: '',
    },
  ];

  axios = axiosMain.default;
  firebase = Firebase.default;

  visibleSection: string;
  backBtn: string;
  nextBtn: string;

  source = 'supplier';
  editMode: boolean;

  constructor(
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.visibleSection = 'part-a';
    this.toggleBtn();
    this.route.queryParams.subscribe(() => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.source = this.router.getCurrentNavigation().extras.state.source;
        this.editMode =
          this.router.getCurrentNavigation().extras.state.editMode;
        if (this.editMode) {
          this.inVendor =
            this.router.getCurrentNavigation().extras.state.viewVendor;
        }
      }
    });
  }

  ngOnInit() {
    this.loadDummy();
  }

  async onNextBtn() {
    if (this.visibleSection === 'part-a' && this.btnBool(0)) {
      this.visibleSection = 'part-b';
      this.toggleBtn();
    } else if (this.visibleSection === 'part-b' && this.btnBool(1)) {
      await this.vendorCounter();
    } else if (
      (this.visibleSection === 'part-a' && !this.btnBool(0)) ||
      (this.visibleSection === 'part-b' && !this.btnBool(1))
    ) {
      (
        await this.toastCtrl.create({
          message: 'Please Enter All Mandatory Fields Correctly..',
          duration: 3000,
        })
      ).present();
    }
  }

  onPrevBtn() {
    if (this.visibleSection === 'part-b') {
      this.visibleSection = 'part-a';
      this.toggleBtn();
    } else if (this.visibleSection === 'part-a') {
      console.log('return to source');
      if (this.source === 'supplier') {
        this.navCtrl.navigateBack('/suppliers');
      } else if (this.source === 'customer') {
        this.navCtrl.navigateBack('/customers');
      }
    }
  }

  toggleBtn() {
    if (this.visibleSection === 'part-a') {
      this.backBtn = 'cancel';
      this.nextBtn = 'next';
    } else if (this.visibleSection === 'part-b') {
      this.backBtn = 'back';
      this.nextBtn = 'submit';
    }
  }

  async vendorCounter() {
    await this.firebase
      .firestore()
      .collection('counters')
      .doc('vendor-counter')
      .get()
      .then((res) => {
        this.inVendor.vendorId = res.get('counter') + 1;
        this.firebase
          .firestore()
          .collection('counters')
          .doc('vendor-counter')
          .update({
            counter: this.firebase.firestore.FieldValue.increment(1),
          });
        this.createFirebase();
        console.log(this.inVendor);
      })
      .catch((error) => console.log(error));
  }

  async createFirebase() {
    await this.firebase
      .firestore()
      .collection('vendors')
      .add({
        vendorId: this.inVendor.vendorId,
        vendorType: this.source,
        vendorName: this.inVendor.vendorName,
        address1: this.inVendor.address1,
        address2: this.inVendor.address2,
        address3: this.inVendor.address3,
        city: this.inVendor.city,
        state: this.inVendor.state,
        country: this.inVendor.country,
        pincode: this.inVendor.pincode,
        description: this.inVendor.description,
        status: 'Active',
        mobile: Number.parseFloat(this.inVendor.mobile),
        email: this.inVendor.email,
        gst: this.inVendor.gst,
        createdBy: this.firebase.auth().currentUser.displayName,
        createDate: this.firebase.firestore.Timestamp.now(),
        lastUpdateDate: this.firebase.firestore.Timestamp.now(),
        lastUpdatedBy: this.firebase.auth().currentUser.displayName,
      })
      .then(() => {
        if (this.source === 'supplier') {
          const navigateExtras: NavigationExtras = {
            state: {
              source: 'new-vendor',
            },
          };
          this.navCtrl.navigateBack('/suppliers', navigateExtras);
        } else if (this.source === 'customer') {
          const navigateExtras: NavigationExtras = {
            state: {
              source: 'new-vendor',
            },
          };
          this.navCtrl.navigateBack('/customers', navigateExtras);
        }
      })
      .catch((error) => console.log(error));
  }

  loadDummy() {
    this.inVendor = {
      vendorId: 0,
      vendorName: 'No One Vendors',
      address1: '1 Champion Lane',
      address2: '',
      address3: '',
      city: 'Vad',
      state: 'GJ',
      country: 'IN',
      pincode: '10',
      description: '',
      status: 'Active',
      mobile: '',
      email: '',
      gst: '',
    };

    //   this.govPincode = [
    //     {
    //       block: 'Vadodara',
    //       branchType: 'Sub Post Office',
    //       circle: 'Gujarat',
    //       country: 'India',
    //       deliveryStatus: 'Delivery',
    //       description: null,
    //       district: 'Vadodara',
    //       division: 'Vadodara East',
    //       name: 'Ajwa Road',
    //       pincode: '390019',
    //       region: 'Vadodara',
    //       state: 'Gujarat',
    //     },
    //     {
    //       block: 'Vadodara',
    //       branchType: 'Branch Post Office',
    //       circle: 'Gujarat',
    //       country: 'India',
    //       deliveryStatus: 'Delivery',
    //       description: null,
    //       district: 'Vadodara',
    //       division: 'Vadodara East',
    //       name: 'Amodar',
    //       pincode: '390019',
    //       region: 'Vadodara',
    //       state: 'Gujarat',
    //     },
    //     {
    //       block: 'Vadodara',
    //       branchType: 'Branch Post Office',
    //       circle: 'Gujarat',
    //       country: 'India',
    //       deliveryStatus: 'Delivery',
    //       description: null,
    //       district: 'Vadodara',
    //       division: 'Vadodara East',
    //       name: 'Ankhol',
    //       pincode: '390019',
    //       region: 'Vadodara',
    //       state: 'Gujarat',
    //     },
    //     {
    //       block: 'Vadodara',
    //       branchType: 'Branch Post Office',
    //       circle: 'Gujarat',
    //       country: 'India',
    //       deliveryStatus: 'Delivery',
    //       description: null,
    //       district: 'Vadodara',
    //       division: 'Vadodara East',
    //       name: 'Bakrol',
    //       pincode: '390019',
    //       region: 'Vadodara',
    //       state: 'Gujarat',
    //     },
    //     {
    //       block: 'Vadodara',
    //       branchType: 'Branch Post Office',
    //       circle: 'Gujarat',
    //       country: 'India',
    //       deliveryStatus: 'Delivery',
    //       description: null,
    //       district: 'Vadodara',
    //       division: 'Vadodara East',
    //       name: 'Kumetha',
    //       pincode: '390019',
    //       region: 'Vadodara',
    //       state: 'Gujarat',
    //     },
    //     {
    //       block: 'Vadodara',
    //       branchType: 'Branch Post Office',
    //       circle: 'Gujarat',
    //       country: 'India',
    //       deliveryStatus: 'Delivery',
    //       description: null,
    //       district: 'Vadodara',
    //       division: 'Vadodara East',
    //       name: 'Nimetha',
    //       pincode: '390019',
    //       region: 'Vadodara',
    //       state: 'Gujarat',
    //     },
    //     {
    //       block: 'Vadodara',
    //       branchType: 'Branch Post Office',
    //       circle: 'Gujarat',
    //       country: 'India',
    //       deliveryStatus: 'Delivery',
    //       description: null,
    //       district: 'Vadodara',
    //       division: 'Vadodara East',
    //       name: 'Sayajipura',
    //       pincode: '390019',
    //       region: 'Vadodara',
    //       state: 'Gujarat',
    //     },
    //   ];
  }

  btnBool(val: number) {
    if (val === 0) {
      if (
        this.inVendor.vendorName.length === 0 ||
        this.inVendor.address1.length === 0 ||
        this.inVendor.pincode.length === 0 ||
        this.inVendor.mobile.length === 0 ||
        this.inVendor.mobile.length < 10 ||
        this.inVendor.mobile.charAt(0) === '0'
      ) {
        return false;
      } else {
        return true;
      }
    } else if (val === 1) {
      if (
        this.inVendor.city.length === 0 ||
        this.inVendor.state.length === 0 ||
        this.inVendor.country.length === 0
      ) {
        return true;
      } else {
        return true;
      }
    }
  }

  // getPincode() {
  //   // const getUrl =
  //     //   'https://api.postalpincode.in/pincode/' + this.inVendor.pincode;
  //     // console.log(getUrl);
  //     // await this.axios
  //     //   .get(getUrl)
  //     //   .then((resp) => {
  //     //     if (
  //     //       resp.data[0].PostOffice !== null &&
  //     //       resp.data[0].Status === 'Success'
  //     //     ) {
  //     //       this.govPincode = resp.data[0].PostOffice;
  //     //     } else {
  //     //       this.inVendor.pincode = '';
  //     //       this.visibleSection = 'part-a';
  //     //       alert('Invalid Pincode!');
  //     //     }
  //     //     console.log(this.govPincode);
  //     //     //console.log(resp.status);
  //     //     console.log(resp.data[0].Status);
  //     //   })
  //     //   .catch((err) => {
  //     //     console.log('Error in getting Pin Area: ' + err);
  //     //   });
  // }
}
