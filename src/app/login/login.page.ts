import { Component, OnInit } from '@angular/core';
import {
  AlertController,
  NavController,
  ToastController,
} from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

import * as Firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  fire = Firebase.default;
  userInfo = {
    email: '',
    password: '',
    username: '',
    role: 5,
  };

  constructor(
    private storage: Storage,
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {
    this.storage.clear();
  }

  ngOnInit() {}

  async login() {
    // this.navCtrl.navigateForward('/home');

    await this.fire
      .auth()
      .signInWithEmailAndPassword(this.userInfo.email, this.userInfo.password)
      .then(async (user) => {
        console.log(user);
        this.storage.set('username', user.user.email);
        this.fire
          .firestore()
          .collection('users')
          .where('uid', '==', user.user.uid)
          .get()
          .then((querySnap) => {
            console.log(querySnap);
          });

        (
          await this.toastCtrl.create({
            message: 'Welcome ' + user.user.displayName,
            duration: 3000,
          })
        ).present();
      })
      .catch(async (err) => {
        console.error(err);
        await this.fire
          .firestore()
          .collection('users')
          .where('uid', '==', 'aG5QfdcNFEa26C03G9I414wbfmh1')
          .get()
          .then((querySnap) => {
            querySnap.docs.forEach((doc) => {
              console.log(doc.data());
            });
          });
        (
          await this.toastCtrl.create({
            message: err.message,
            duration: 3000,
          })
        ).present();
      });
  }
}
