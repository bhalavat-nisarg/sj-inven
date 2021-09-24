import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { LoadingController, NavController } from '@ionic/angular';

import * as Firebase from 'firebase/app';
import 'firebase/firestore';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.page.html',
  styleUrls: ['./inventory.page.scss'],
})
export class InventoryPage implements OnInit {
  inProducts = [
    {
      productCode: 0,
      productName: '',
      catCode: '',
      mrp: 0.0,
      purPrice: 0.0,
      selPrice: 0.0,
      qty: 0,
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

  productPage: boolean;

  firebase = Firebase.default;

  constructor(
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.productPage = false;
    this.route.queryParams.subscribe(() => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.productPage =
          this.router.getCurrentNavigation().extras.state.productPage;
      }
    });
  }

  async ngOnInit() {
    this.inProducts = [];
    this.getProducts();

    (
      await this.loadingCtrl.create({
        message: 'Please Wait..',
        duration: 3000,
      })
    ).present();

    // console.log(this.productPage);
    // if (this.productPage === false) {
    //   console.log('Not from Product Page');
    // }
    //this.loadingDummy();
    this.searchBar = document.querySelector('ion-searchbar');
    this.searchBar.addEventListener('ionInput', this.handleInput);
  }

  async refresh() {
    (
      await this.loadingCtrl.create({
        message: 'Please Wait..',
        duration: 3000,
      })
    ).present();

    this.inProducts = [];
    this.getProducts();
  }

  goToCategory() {
    this.navCtrl.navigateForward('/category');
  }

  goToProducts(prodObj: any) {
    const navigateExtras: NavigationExtras = {
      state: {
        viewProd: prodObj,
      },
    };

    this.navCtrl.navigateForward('/products', navigateExtras);
  }

  getProducts() {
    this.firebase
      .firestore()
      .collection('products')
      .orderBy('productCode')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((docRecord) => {
          this.inProducts.push({
            productCode: docRecord.get('productCode'),
            productName: docRecord.get('productName'),
            catCode: docRecord.get('catCode'),
            mrp: docRecord.get('mrp'),
            purPrice: docRecord.get('purPrice'),
            selPrice: docRecord.get('selPrice'),
            qty: docRecord.get('qty'),
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
    this.inProducts = [
      {
        productCode: 10001,
        productName: 'Rich Chocolate',
        catCode: 'C001',
        mrp: 25.0,
        purPrice: 0.0,
        selPrice: 25.5,
        qty: 100,
        startDate: '01 Aug 2021',
        endDate: '31 Dec 4712',
        createdBy: '-1',
        createDate: '01 Aug 2021',
        lastUpdateDate: '01 Aug 2021',
        lastUpdatedBy: '-1',
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
