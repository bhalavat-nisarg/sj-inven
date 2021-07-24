import { Component } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  username = 'Nisarg';

  constructor(
    private navCtrl: NavController,
    private menuCtrl: MenuController
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
    this.navCtrl.navigateForward('/inventory');
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
