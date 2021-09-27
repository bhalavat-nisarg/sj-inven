import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router, ActivatedRoute } from '@angular/router';
import {
  AlertController,
  LoadingController,
  NavController,
  ToastController,
} from '@ionic/angular';
import { Buffer } from 'buffer';
import { GlobalConstants } from '../common/global';

import * as axiosMain from 'axios';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

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
    fullName: '',
  };

  axios = axiosMain.default;

  apiUser = GlobalConstants.apiKey;
  createURL = GlobalConstants.apiURL + '/sj/auth/add-user';
  deleteURL = GlobalConstants.apiURL + '/sj/auth/delete-user';

  totalUsers: number;
  accountUsers: number;
  edit = false;
  addingAllowed: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastCtrl: ToastController,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) {
    this.route.queryParams.subscribe(() => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.accountUsers =
          this.router.getCurrentNavigation().extras.state.accUsers;
        this.totalUsers =
          this.router.getCurrentNavigation().extras.state.usersCnt;
        this.edit = this.router.getCurrentNavigation().extras.state.edit;
        if (this.edit) {
          this.userInfo.uid =
            this.router.getCurrentNavigation().extras.state.userVal.uid;
          this.userInfo.fullName =
            this.router.getCurrentNavigation().extras.state.userVal.fullName;
          this.userInfo.username =
            this.router.getCurrentNavigation().extras.state.userVal.username;
          this.userInfo.role =
            this.router.getCurrentNavigation().extras.state.userVal.role;
        }
      }
    });
  }

  ngOnInit() {
    console.log(this.accountUsers - this.totalUsers);
  }

  async create() {
    if (
      this.accountUsers - this.totalUsers !== 0 &&
      this.accountUsers - this.totalUsers > 0 &&
      this.totalUsers <= this.accountUsers
    ) {
      this.addingAllowed = true;
    }
    if (
      this.userInfo.fullName === '' ||
      this.userInfo.password === '' ||
      this.userInfo.username === '' ||
      this.userInfo.role === 5
    ) {
      (
        await this.toastCtrl.create({
          header: 'Error',
          message: 'Please Enter all details..',
          duration: 3000,
        })
      ).present();
    } else if (this.addingAllowed) {
      this.addNewUser();
    } else {
      (
        await this.alertCtrl.create({
          header: 'Invalid',
          subHeader: 'User limit reached..',
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
            },
            {
              text: 'Okay',
              role: 'submit',
              handler: () => {
                this.navCtrl.navigateBack('/users');
              },
            },
          ],
        })
      ).present();
    }
  }

  onCancel() {
    this.navCtrl.navigateBack('/users');
  }

  async deleteUser() {
    console.log('Delete user ' + this.userInfo.uid);
    (
      await this.alertCtrl.create({
        header: 'Delete User',
        subHeader: 'Are you sure? This action can not be undone.',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
          },
          {
            text: 'Okay',
            role: 'submit',
            handler: () => {
              this.firebaseDelete(this.userInfo.uid);
            },
          },
        ],
      })
    ).present();
  }

  async firebaseDelete(uid) {
    (
      await this.loadingCtrl.create({
        message: 'Please Wait..',
        duration: 3000,
      })
    ).present();
    console.log(uid);
    this.axios
      .post(
        this.deleteURL,
        {
          uid,
        },
        {
          headers: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'Content-Type': 'application/json',
            // eslint-disable-next-line @typescript-eslint/naming-convention
            Authorization: 'Basic ' + this.apiUser,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        this.userInfo.uid = response.data.uid;

        const navigateExtras: NavigationExtras = {
          state: {
            operate: true,
            delete: true,
          },
        };

        this.navCtrl.navigateBack('/users', navigateExtras);
      });
  }

  async addNewUser() {
    (
      await this.loadingCtrl.create({
        message: 'Please Wait..',
        duration: 3000,
      })
    ).present();
    console.log(this.userInfo);
    this.userInfo.email = this.userInfo.username + '@scoops-joy.app';
    const token = this.encodeBase64(
      this.userInfo.username,
      this.userInfo.password
    );
    await this.axios
      .post(
        this.createURL,
        {
          email: this.userInfo.email,
          token,
          username: this.userInfo.username,
          role: this.userInfo.role,
          fullName: this.userInfo.fullName,
        },
        {
          headers: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'Content-Type': 'application/json',
            // eslint-disable-next-line @typescript-eslint/naming-convention
            Authorization: 'Basic ' + this.apiUser,
          },
        }
      )
      .then(async (response) => {
        console.log(response.data);
        this.userInfo.uid = response.data.uid;
        (
          await this.alertCtrl.create({
            header: 'Success',
            subHeader: 'User Created!',
            buttons: [
              {
                text: 'Okay',
                role: 'submit',
                handler: () => {
                  const navigateExtras: NavigationExtras = {
                    state: {
                      operate: true,
                      delete: false,
                      user: '',
                    },
                  };

                  this.navCtrl.navigateBack('/users', navigateExtras);
                },
              },
            ],
          })
        ).present();
      });
  }

  encodeBase64(username: string, password: string) {
    const inputText = username + ':' + password;
    const buff = Buffer.from(inputText, 'utf8');
    const token = buff.toString('base64');
    //console.log(token);
    return token;
  }
}
