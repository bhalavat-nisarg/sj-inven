import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';

import * as Firebase from 'firebase/app';
import 'firebase/firestore';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit {
  inCategory = [
    {
      catCode: '',
      catDesc: '',
      startDate: '',
      endDate: '',
      createdBy: '',
      createDate: '',
      lastUpdateDate: '',
      lastUpdatedBy: '',
      imgUrl: '',
    },
  ];

  searchBar: any;
  items: any;
  firebase = Firebase.default;

  constructor(
    private navCtrl: NavController,
    private loadingCtrl: LoadingController
  ) {
    this.getCategory();
  }

  async ngOnInit() {
    this.inCategory = [];
    this.searchBar = document.querySelector('ion-searchbar');

    (
      await this.loadingCtrl.create({
        message: 'Please Wait..',
        duration: 3000,
      })
    ).present();

    // this.loadingDummy();
    this.searchBar.addEventListener('ionInput', this.handleInput);
  }

  goToInventory() {
    this.navCtrl.navigateBack('/inventory');
  }

  async getCategory() {
    await this.firebase
      .firestore()
      .collection('category')
      .orderBy('catCode')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((docRecord) => {
          this.inCategory.push({
            catCode: docRecord.get('catCode'),
            catDesc: docRecord.get('catDesc'),
            startDate: docRecord.get('startDate'),
            endDate: docRecord.get('endDate'),
            createdBy: docRecord.get('createdBy'),
            createDate: docRecord.get('createDate'),
            lastUpdateDate: docRecord.get('lastUpdateDate'),
            lastUpdatedBy: docRecord.get('lastUpdatedBy'),
            imgUrl: '../../assets/extras/ice-def.png',
          });
        });
      })
      .catch((error) => console.log(error));
  }

  loadingDummy() {
    this.inCategory = [
      {
        catCode: 'A001',
        catDesc: 'Badabite Ice Cream ',
        startDate: '01 Aug 2021',
        endDate: '31 Dec 4712',
        createdBy: '-1',
        createDate: '01 Aug 2021',
        lastUpdateDate: '-1',
        lastUpdatedBy: '01 Aug 2021',
        imgUrl: '../../assets/extras/ice-def.png',
      },
    ];
  }

  handleInput(event) {
    // search Bar
    this.items = Array.from(document.querySelectorAll('.catList'));
    // this.items = Array.from(document.querySelector('.prodList').children);

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
