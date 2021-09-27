import { Component } from '@angular/core';
import {
  AlertController,
  IonRouterOutlet,
  NavController,
} from '@ionic/angular';

import { Platform } from '@ionic/angular';
import { App } from '@Capacitor/app';
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

  handle: PluginListenerHandle = App.addListener(
    'backButton',
    this.listenerFunc
  );

  constructor(
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private platform: Platform,
    private routerOutlet: IonRouterOutlet
  ) {
    // this.platform.backButton.subscribeWithPriority(-1, async () => {
    //   if (!this.routerOutlet.canGoBack()) {
    //     (
    //       await this.alertCtrl.create({
    //         header: 'Quit App?',
    //         buttons: [
    //           {
    //             text: 'Yes',
    //             role: 'submit',
    //             handler: () => {
    //               App.exitApp();
    //             },
    //           },
    //           {
    //             text: 'No',
    //             role: 'cancel',
    //           },
    //         ],
    //       })
    //     ).present();
    //   } else {
    //     this.navCtrl.back();
    //   }
    // });
  }

  async listenerFunc() {
    this.navCtrl.back();
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
