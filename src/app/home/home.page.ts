import { Component } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';

import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(
    private navCtrl: NavController,
    private menuCtrl: MenuController,
    private platform: Platform
  ) {}

  inventory() {
    this.navCtrl.navigateRoot('/inventory');
    this.menuCtrl.close();
  }

  users() {
    this.navCtrl.navigateRoot('/users');
    this.menuCtrl.close();
  }

  invoices() {
    this.navCtrl.navigateRoot('/invoices');
    this.menuCtrl.close();
  }

  suppliers() {
    this.navCtrl.navigateRoot('/suppliers');
    this.menuCtrl.close();
  }

  receipts() {
    this.navCtrl.navigateRoot('/receipts');
    this.menuCtrl.close();
  }

  customers() {
    this.navCtrl.navigateRoot('/customers');
    this.menuCtrl.close();
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
