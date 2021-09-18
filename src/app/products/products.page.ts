import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

import firebase from 'firebase/app';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {
  inProducts = {
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
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private storage: Storage
  ) {
    this.route.queryParams.subscribe(() => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.inProducts =
          this.router.getCurrentNavigation().extras.state.viewProd;
      }
    });
  }

  ngOnInit() {
    this.inProducts = {
      productCode: 10001,
      productName: 'Rich Chocolate',
      catCode: 'C001',
      mrp: 25.0,
      purPrice: 0.0,
      selPrice: 25.5,
      qty: 0,
      startDate: '01 Aug 2021',
      endDate: '31 Dec 4712',
      createdBy: '-1',
      createDate: '01 Aug 2021',
      lastUpdateDate: '01 Aug 2021',
      lastUpdatedBy: '-1',
      imgUrl: '../../assets/extras/ice-def.png',
    };
    console.log(this.inProducts);
  }

  goToInventory() {
    const navigateExtras: NavigationExtras = {
      state: {
        productPage: true,
      },
    };
    this.navCtrl.navigateBack('/inventory', navigateExtras);
  }
}
