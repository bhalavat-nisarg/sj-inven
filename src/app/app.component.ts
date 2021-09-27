import { Component } from '@angular/core';
import { AlertController, MenuController, NavController } from '@ionic/angular';

import firebase from 'firebase/app';
import 'firebase/auth';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  userInfo = {
    email: '',
    password: '',
    username: 'Guest',
    role: 5,
  };

  firebaseConfig = {
    apiKey: 'AIzaSyA1INZKfTFxy1girBaoP7P7MDyDULAFKMw',
    authDomain: 'scoops-joy.firebaseapp.com',
    projectId: 'scoops-joy',
    storageBucket: 'scoops-joy.appspot.com',
    messagingSenderId: '483327075550',
    appId: '1:483327075550:web:63b7f4692b7af93ec34e4f',
    measurementId: 'G-DL41BFSQ5V',
  };

  constructor(
    private navCtrl: NavController,
    private menuCtrl: MenuController,
    private alertCtrl: AlertController
  ) {
    firebase.initializeApp(this.firebaseConfig);
  }

  account() {
    this.navCtrl.navigateForward('/myaccount');
    this.menuCtrl.close();
  }

  home() {
    this.navCtrl.navigateRoot('/home');
    this.menuCtrl.close();
  }

  inventory() {
    this.navCtrl.navigateForward('/inventory');
    this.menuCtrl.close();
  }

  category() {
    this.navCtrl.navigateForward('/category');
    this.menuCtrl.close();
  }

  users() {
    this.navCtrl.navigateForward('/users');
    this.menuCtrl.close();
  }

  invoices() {
    this.navCtrl.navigateForward('/invoices');
    this.menuCtrl.close();
  }

  suppliers() {
    this.navCtrl.navigateForward('/suppliers');
    this.menuCtrl.close();
  }

  receipts() {
    this.navCtrl.navigateForward('/receipts');
    this.menuCtrl.close();
  }

  customers() {
    this.navCtrl.navigateForward('/customers');
    this.menuCtrl.close();
  }

  // settings() {
  //   this.navCtrl.navigateForward('/settings');
  //   this.menuCtrl.close();
  // }

  async logout() {
    await firebase
      .auth()
      .signOut()
      .then(() => {
        this.navCtrl.navigateRoot('/login');
      })
      .catch((error) => console.log(error));
    this.menuCtrl.close();
  }

  exit() {
    // eslint-disable-next-line @typescript-eslint/dot-notation
    navigator['app'].exitApp();
  }
}
