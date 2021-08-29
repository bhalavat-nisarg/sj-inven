import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
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

  visibleSection: string;

  constructor(private navCtrl: NavController) {
    this.visibleSection = 'part-a';
  }

  ngOnInit() {}

  onCancelBtn() {
    //this.navCtrl.navigateBack('/home/posting');
  }

  onSubmitBtn() {
    // if (this.btnBool(3)) {
    //     this.flatAd.propRooms = [];
    //     this.flatAd.propRooms = this.roomDetails;
    //     console.log(this.flatAd);
    //     this.postFire();
    // } else {
    //     console.log('Fields are missing..');
    // }
  }

  onPlusBtn() {
    // if (this.flatAd.propRoomsCount < 5) {
    //     this.flatAd.propRoomsCount = this.flatAd.propRoomsCount + 1;
    //     let i = this.flatAd.propRoomsCount;
    //     this.roomSection.push('Room_' + i);
    // } else {
    //     console.log('Max Value reached');
    // }
  }
  onMinusBtn() {
    // if (this.flatAd.propRoomsCount > 0) {
    //     this.flatAd.propRoomsCount = this.flatAd.propRoomsCount - 1;
    //     this.roomSection.pop();
    //     this.roomDetails = [];
    // } else {
    //     console.log('Min Value reached');
    // }
  }

  async onNextBtn() {
    this.govPincode = [];
    if (this.visibleSection === 'part-a' && this.btnBool(0)) {
      this.visibleSection = 'part-b';
      const getUrl =
        'https://api.postalpincode.in/pincode/' + this.inVendor.pincode;
      console.log(getUrl);
      await this.axios
        .get(getUrl)
        .then((resp) => {
          if (
            resp.data[0].PostOffice !== null &&
            resp.data[0].Status === 'Success'
          ) {
            this.govPincode = resp.data[0].PostOffice;
          } else {
            this.inVendor.pincode = '';
            this.visibleSection = 'part-a';
            alert('Invalid Pincode!');
          }
          console.log(this.govPincode);
          //console.log(resp.status);
          console.log(resp.data[0].Status);
        })
        .catch((err) => {
          console.log('Error in getting Pin Area: ' + err);
        });
    }
  }

  onPrevBtn() {
    if (this.visibleSection === 'part-b') {
      this.visibleSection = 'part-a';
    }
  }

  btnBool(val: number) {
    return true;
  }
}
