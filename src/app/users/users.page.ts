import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router, ActivatedRoute } from '@angular/router';
import { LoadingController, NavController } from '@ionic/angular';

import * as Firebase from 'firebase/app';
import 'firebase/firestore';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {
  users = [
    {
      uid: '',
      fullName: '',
      username: ',',
      image: '',
      role: 5,
    },
  ];

  firebase = Firebase.default;
  totalUsers = 0;
  maxUsersCnt: number;

  searchBar: any;
  items: any;
  operate = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController
  ) {
    this.route.queryParams.subscribe(() => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.operate = this.router.getCurrentNavigation().extras.state.operate;
      }
    });
  }
  async ionViewWillEnter() {
    this.maxUsers();
    if (this.operate === true) {
      this.users = [];
      this.getUsers();
    }
  }

  async ngOnInit() {
    //this.users = [];
    this.searchBar = document.querySelector('ion-searchbar');
    // (
    //   await this.loadingCtrl.create({
    //     message: 'Please Wait..',
    //     duration: 5000,
    //   })
    // ).present();

    // this.loadDummyData(); // dummy data for all users
    this.getUsers();
    this.searchBar.addEventListener('ionInput', this.handleInput);
  }

  addNewUser() {
    const navigationExtra: NavigationExtras = {
      state: {
        usersCnt: this.totalUsers,
        userVal: null,
        edit: false,
        accUsers: this.maxUsersCnt,
      },
    };
    this.navCtrl.navigateForward('/add-user', navigationExtra);
  }

  onClick(user: any) {
    console.log(user);
    const navigationExtra: NavigationExtras = {
      state: {
        usersCnt: this.totalUsers,
        userVal: user,
        edit: true,
        accUsers: this.maxUsersCnt,
      },
    };
    this.navCtrl.navigateForward('/add-user', navigationExtra);
  }

  getUsers() {
    this.firebase
      .firestore()
      .collection('users')
      .where('account', '==', 'sj')
      .get()
      .then((docRecords) => {
        this.totalUsers = docRecords.size;
        docRecords.forEach((record) => {
          this.users.push({
            uid: record.get('uid'),
            fullName: record.get('fullName'),
            username: record.get('username'),
            image: '../../assets/icon/favicon.png',
            role: record.get('role'),
          });
          //console.log(this.users);
        });
      })
      .catch((error) => console.log(error));
  }

  loadDummyData() {
    this.users = [
      {
        uid: '01',
        fullName: 'Rishi Ramesh',
        username: 'r.rishi',
        image: '../../assets/icon/favicon.png',
        role: 2,
      },
      {
        uid: '02',
        fullName: 'Dhrishti Dewan',
        username: 'd.dhrishti',
        image: '../../assets/icon/favicon.png',
        role: 2,
      },
      {
        uid: '03',
        fullName: 'Kabir Bali',
        username: 'b.kabir',
        image: '../../assets/icon/favicon.png',
        role: 5,
      },
      {
        uid: '04',
        fullName: 'Sanjit Jani',
        username: 'j.sanjit',
        image: '../../assets/icon/favicon.png',
        role: 2,
      },
      {
        uid: '05',
        fullName: 'Abha Gulati',
        username: 'g.abha',
        image: '../../assets/icon/favicon.png',
        role: 2,
      },
    ];
  }

  handleInput(event) {
    // search Bar
    this.items = Array.from(document.querySelectorAll('.userList'));
    // this.items = Array.from(document.querySelector('.userList').children);

    const query = event.srcElement.value.toLowerCase();
    // console.log(this.items);
    requestAnimationFrame(() => {
      this.items.forEach((item) => {
        // const shouldShow = item.children[1].textContent.toLowerCase().indexOf(query) > -1;
        const shouldShow = item.textContent.toLowerCase().indexOf(query) > -1;
        item.style.display = shouldShow ? 'block' : 'none';
      }, this);
    });
  }

  async maxUsers() {
    await this.firebase
      .firestore()
      .collection('accounts')
      .where('code', '==', 'sj')
      .get()
      .then((resp) => {
        resp.forEach((account) => {
          this.maxUsersCnt = Number.parseInt(
            account.get('accountUsers').toString(),
            10
          );
        });
        console.log(this.maxUsersCnt);
      })
      .catch((error) => console.log(error));
  }
}
