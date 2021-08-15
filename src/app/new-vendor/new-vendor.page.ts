import { Component, OnInit } from '@angular/core';
import * as axiosMain from 'axios';

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
    status: '',
    mobile: '',
    email: '',
    gst: '',
    createdBy: '',
    createDate: '',
    lastUpdateDate: '',
    lastUpdatedBy: '',
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
  pinCode: any;
  inPin: string;

  constructor() {}

  ngOnInit() {
    this.pinCode = document.getElementById('pincode');
    console.log(this.pinCode);
    this.pinCode.addEventListener('ionInput', this.handleInput);
  }

  async addNewSuppliers(pin: string) {
    const getUrl = 'https://api.postalpincode.in/pincode/' + pin;
    console.log(getUrl);
    await this.axios
      .get(getUrl)
      .then((resp) => {
        if (resp.data[0].PostOffice !== null) {
          this.govPincode = resp.data[0].PostOffice;
        }
        console.log(this.govPincode);
        console.log(resp.status);
      })
      .catch((err) => {
        console.log('Error in getting Pin Area: ' + err);
      });
  }

  handleInput(event) {
    // // search Bar
    // this.items = Array.from(document.querySelectorAll('.prodList'));
    // // this.items = Array.from(document.querySelector('.prodList').children);

    // const query = event.srcElement.value.toLowerCase();
    // // console.log(this.items);
    // requestAnimationFrame(() => {
    //   this.items.forEach((item) => {
    //     // const shouldShow = item.children[1].textContent.toLowerCase().indexOf(query) > -1;
    //     const shouldShow = item.textContent.toLowerCase().indexOf(query) > -1;
    //     item.style.display = shouldShow ? 'block' : 'none';
    //   }, this);
    // });
    console.log(event);
    if (this.inPin === undefined) {
      this.inPin = event.detail.data;
    } else {
      this.inPin += event.detail.data;
    }
    console.log(this.inPin);
  }
}
