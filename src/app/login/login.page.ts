import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  userInfo = {
    uid: '',
    email: '',
    password: '',
    username: '',
    role: 5,
  };

  constructor(
    private storage: Storage,
    private navCtrl: NavController,
    private toastCtrl: ToastController
  ) {
    this.storage.clear();
  }

  ngOnInit() {}

  async login() {
    await firebase
      .auth()
      .signInWithEmailAndPassword(this.userInfo.email, this.userInfo.password)
      .then(async (user) => {
        console.log(user);
        this.storage.set('email', user.user.email);
        this.userInfo.uid = user.user.uid;
        firebase
          .firestore()
          .collection('users')
          .where('uid', '==', user.user.uid)
          .get()
          .then((querySnap) => {
            querySnap.docs.forEach((doc) => {
              this.userInfo.username = doc.data().username;
              this.userInfo.role = doc.data().role;
            });
          });

        (
          await this.toastCtrl.create({
            message: 'Welcome ' + this.userInfo.username,
            duration: 3000,
          })
        ).present();
        this.navCtrl.navigateForward('/home');
      })
      .catch(async (err) => {
        console.error(err);
        (
          await this.toastCtrl.create({
            message: err.message,
            duration: 3000,
          })
        ).present();
      });
  }
}
