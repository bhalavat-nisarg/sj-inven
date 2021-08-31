import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

import firebase from 'firebase/app';
import 'firebase/firestore';

@Component({
  selector: 'app-myaccount',
  templateUrl: './myaccount.page.html',
  styleUrls: ['./myaccount.page.scss'],
})
export class MyAccountPage implements OnInit {
  uid = 'LlTWpI8PVGxdOLOta3WL';
  userInfo = {
    uid: '',
    name: '',
    password: '',
    username: '',
    role: 5,
    roleName: '',
    mobile: '',
    accountName: '',
    accountType: '',
    accountUsers: 0,
  };

  constructor(private alertCtrl: AlertController) {}

  ionViewWillEnter() {
    firebase
      .firestore()
      .collection('accounts')
      .where('uid', '==', this.uid)
      .get()
      .then((snapShot) => {
        snapShot.forEach((docs) => {
          this.userInfo.uid = docs.data().uid;
          this.userInfo.name = docs.data().fullName;
          this.userInfo.username = docs.data().username;
          this.userInfo.role = docs.data().role;
          this.userInfo.roleName = docs.data().roleName;
          this.userInfo.mobile = docs.data().mobile;
          this.userInfo.accountName = docs.data().accountName;
          this.userInfo.accountType = docs.data().accountType;
          this.userInfo.accountUsers = docs.data().accountUsers;
          console.log(this.userInfo);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  ngOnInit() {}

  async help() {
    (
      await this.alertCtrl.create({
        header: 'Help',
        subHeader: 'For any inquiries please contact your Account Manager.',
        buttons: [
          {
            text: 'okay',
            role: 'submit',
          },
        ],
      })
    ).present();
  }
}
