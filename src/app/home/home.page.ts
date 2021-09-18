import { Component } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';

import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  userInfo = {
    uid: '',
    email: '',
    password: '',
    username: '',
    role: 5,
  };

  constructor(
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private platform: Platform
  ) {}

  inventory() {
    this.navCtrl.navigateRoot('/inventory');
  }

  users() {
    this.navCtrl.navigateRoot('/users');
  }

  invoices() {
    this.navCtrl.navigateRoot('/invoices');
  }

  suppliers() {
    this.navCtrl.navigateRoot('/suppliers');
  }

  receipts() {
    this.navCtrl.navigateRoot('/receipts');
  }

  customers() {
    this.navCtrl.navigateRoot('/customers');
  }

  exit() {
    // eslint-disable-next-line @typescript-eslint/dot-notation
    navigator['app'].exitApp();
  }

  ionViewDidEnter() {
    this.platform.backButton.subscribe(() => {
      // eslint-disable-next-line @typescript-eslint/dot-notation
      navigator['app'].exitApp();
    });
  }
}
