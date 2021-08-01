import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {
  users = [
    {
      uid: '',
      name: '',
      username: ',',
      image: '',
      role: 0,
    },
  ];

  searchBar: any;
  items: any;

  constructor(
    private navCtrl: NavController,
    private loadingCtrl: LoadingController
  ) {}

  async ngOnInit() {
    this.users = [];
    this.searchBar = document.querySelector('ion-searchbar');
    (
      await this.loadingCtrl.create({
        message: 'Please Wait..',
        duration: 5000,
      })
    ).present();

    this.loadDummyData(); // dummy data for all users
    this.searchBar.addEventListener('ionInput', this.handleInput);
  }

  add() {
    this.navCtrl.navigateForward('/add-user');
  }

  loadDummyData() {
    this.users = [
      {
        uid: '01',
        name: 'Rishi Ramesh',
        username: 'r.rishi',
        image: '../../assets/icon/favicon.png',
        role: 5,
      },
      {
        uid: '02',
        name: 'Dhrishti Dewan',
        username: 'd.dhrishti',
        image: '../../assets/icon/favicon.png',
        role: 5,
      },
      {
        uid: '03',
        name: 'Kabir Bali',
        username: 'b.kabir',
        image: '../../assets/icon/favicon.png',
        role: 5,
      },
      {
        uid: '04',
        name: 'Sanjit Jani',
        username: 'j.sanjit',
        image: '../../assets/icon/favicon.png',
        role: 5,
      },
      {
        uid: '05',
        name: 'Abha Gulati',
        username: 'g.abha',
        image: '../../assets/icon/favicon.png',
        role: 5,
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
}
