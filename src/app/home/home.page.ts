import { Component } from '@angular/core';
import {
  AlertController,
  IonRouterOutlet,
  NavController,
  ToastController,
} from '@ionic/angular';

import { Platform } from '@ionic/angular';
import { App } from '@capacitor/app';
import { PluginListenerHandle } from '@capacitor/core';

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
  backTimer = 0;

  constructor(
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private platform: Platform,
    private routerOutlet: IonRouterOutlet,
    private toastCtrl: ToastController
  ) {
    this.platform.backButton.subscribeWithPriority(-1, async () => {
      if (Date.now() - this.backTimer > 5000) {
        (
          await this.toastCtrl.create({
            message: 'Press back again to Quit!',
            duration: 3000,
          })
        ).present();
        this.backTimer = Date.now();
      } else {
        App.exitApp();
      }

      // if (!this.routerOutlet.canGoBack()) {
      //   (
      //     await this.alertCtrl.create({
      //       header: 'Quit App?',
      //       buttons: [
      //         {
      //           text: 'Yes',
      //           role: 'submit',
      //           handler: () => {
      //             App.exitApp();
      //           },
      //         },
      //         {
      //           text: 'No',
      //           role: 'cancel',
      //         },
      //       ],
      //     })
      //   ).present();
      // } else {
      //   this.navCtrl.back();
      // }
    });
  }

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
    App.exitApp();
  }
}
