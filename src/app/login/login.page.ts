import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { Buffer } from 'buffer';
import { GlobalConstants } from '../common/global';

import * as axiosMain from 'axios';
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
    token: '',
    fullName: '',
  };

  axios = axiosMain.default;

  apiUser = GlobalConstants.apiKey;
  loginURL = GlobalConstants.apiURL + '/sj/auth/login';

  constructor(
    private navCtrl: NavController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.userInfo.username = 'dummy.user2';
    this.userInfo.password = '123456';
  }

  async login() {
    let tokenStr: string;
    if (this.userInfo.username === '' || this.userInfo.password === '') {
      console.log('Please enter username & password');
    } else {
      tokenStr = this.encodeBase64(
        this.userInfo.username,
        this.userInfo.password
      );
    }

    await this.axios
      .post(
        this.loginURL,
        {
          token: tokenStr,
        },
        {
          headers: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            //'Content-Type': 'application/json',
            // eslint-disable-next-line @typescript-eslint/naming-convention
            Accept: '*/*',
            // eslint-disable-next-line @typescript-eslint/naming-convention
            Authorization: 'Basic ' + this.apiUser,
          },
        }
      )
      .then((resp) => {
        // console.log(resp.data);
        this.userInfo.uid = resp.data.user.uid;
        this.userInfo.fullName = resp.data.user.fullName;
        this.userInfo.token = resp.data.value.token;
        this.userInfo.email = resp.data.user.email;
        this.firebaseLogin(this.userInfo.email, this.userInfo.password);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  encodeBase64(username: string, password: string) {
    const inputText = username + ':' + password;
    const buff = Buffer.from(inputText, 'utf8');
    const token = buff.toString('base64');
    //console.log(token);
    return token;
  }

  async firebaseLogin(email: string, pass: string) {
    await firebase
      .auth()
      .signInWithEmailAndPassword(email, pass)
      .then(() => {
        this.navCtrl.navigateRoot('/home');
      })
      .catch((e) => {
        console.log(e);
      });
  }
}
