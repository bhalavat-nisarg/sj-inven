import { Component, OnInit } from '@angular/core';
import {
  AlertController,
  NavController,
  ToastController,
} from '@ionic/angular';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.page.html',
  styleUrls: ['./add-user.page.scss'],
})
export class AddUserPage implements OnInit {
  userInfo = {
    uid: '',
    email: '',
    password: '',
    username: '',
    role: 5,
  };

  masterPass: string;
  masterEmail: string;

  createdUser: any;
  createdUserEmail: string;

  constructor(
    private toastCtrl: ToastController,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private storage: Storage
  ) {
    this.storage.get('email').then((val) => {
      this.masterEmail = val;
    });
  }

  ngOnInit() {
    this.createdUser = firebase.auth().currentUser;
  }

  async create() {
    if (
      // this.userInfo.email === '' ||
      // this.userInfo.password === '' ||
      //this.userInfo.username === ''
      false
    ) {
      (
        await this.toastCtrl.create({
          header: 'Error',
          message: 'Please Enter all details..',
          duration: 3000,
        })
      ).present();
    } else {
      (
        await this.alertCtrl.create({
          header: 'Verify Yourself',
          inputs: [
            {
              type: 'password',
              placeholder: 'Enter Password',
              name: 'Password',
              value: '',
            },
          ],
          buttons: [
            {
              text: 'cancel',
              role: 'cancel',
              handler: () => {
                this.userInfo.username = '';
                this.userInfo.password = '';
                this.userInfo.email = '';
                this.userInfo.role = 5;
              },
            },
            {
              text: 'okay',
              role: 'submit',
              handler: (data) => {
                this.masterPass = data.Password;
                this.createAndLogin();
              },
            },
          ],
        })
      ).present();
    }
  }

  onCancel() {
    if (this.masterPass === 'invalid') {
      this.navCtrl.navigateRoot('/login');
    } else {
      this.navCtrl.navigateBack('/users');
    }
  }

  async createAndLogin() {
    // console.log(this.masterEmail, this.masterPass);

    await firebase
      .auth()
      .createUserWithEmailAndPassword(
        this.userInfo.email,
        this.userInfo.password
      )
      .then(async (response) => {
        this.userInfo.uid = response.user.uid;
        console.log(this.userInfo);
      })
      .catch(async (err) => {
        (
          await this.toastCtrl.create({
            message: err.message,
            duration: 3000,
          })
        ).present();
      });

    this.createdUser = firebase.auth().currentUser;
    this.createdUserEmail = firebase.auth().currentUser.email;

    await firebase.auth().signOut();
    await this.signInMaster();
  }

  async signInMaster() {
    await firebase
      .auth()
      .signInWithEmailAndPassword(this.masterEmail, this.masterPass)
      .then(async () => {
        await firebase
          .firestore()
          .collection('users')
          .add({
            uid: this.userInfo.uid,
            username: this.userInfo.username,
            email: this.userInfo.email,
            role: this.userInfo.role,
          })
          .then(() => {
            this.navCtrl.pop();
          })
          .catch((err) => {
            console.log(err.message);
          });
      })
      .catch(async () => {
        if (this.createdUserEmail !== 'abcd@gmail.com') {
          this.createdUser.delete().then(() => {
            console.log('user removed');
          });
        }
        this.masterPass = 'invalid';
        (
          await this.toastCtrl.create({
            message: 'Invalid Credentials',
            duration: 3000,
          })
        ).present();
      });
  }

  ionViewDidLeave() {
    if (this.masterPass === 'invalid') {
      this.navCtrl.navigateRoot('/login');
    }
  }
}
