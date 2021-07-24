import { Component } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';

import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  username = 'Nisarg';

  constructor(
    private navCtrl: NavController,
    private menuCtrl: MenuController,
    private platform: Platform
  ) {}

  profile() {
    this.navCtrl.navigateForward('/myprofile');
    this.menuCtrl.close();
  }

  home() {
    this.navCtrl.navigateRoot('/home');
    this.menuCtrl.close();
  }

  inventory() {
    this.navCtrl.navigateRoot('/home');
    this.menuCtrl.close();
  }

  users() {
    this.navCtrl.navigateRoot('/home');
    this.menuCtrl.close();
  }

  invoices() {
    this.navCtrl.navigateRoot('/home');
    this.menuCtrl.close();
  }

  suppliers() {
    this.navCtrl.navigateRoot('/home');
    this.menuCtrl.close();
  }

  receipts() {
    this.navCtrl.navigateRoot('/home');
    this.menuCtrl.close();
  }

  customers() {
    this.navCtrl.navigateRoot('/home');
    this.menuCtrl.close();
  }

  settings() {
    this.navCtrl.navigateForward('/settings');
    this.menuCtrl.close();
  }

  logout() {
    this.navCtrl.navigateRoot('/login');
    this.menuCtrl.close();
  }

  exit() {
    // eslint-disable-next-line @typescript-eslint/dot-notation
    navigator['app'].exitApp();
  }
}
