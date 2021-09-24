import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import {
  AlertController,
  LoadingController,
  NavController,
} from '@ionic/angular';

import * as Firebase from 'firebase/app';
import 'firebase/firestore';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.page.html',
  styleUrls: ['./invoices.page.scss'],
})
export class InvoicesPage implements OnInit {
  mode = 'new';
  firebase = Firebase.default;
  items: any;
  searchBar: any;

  invoices = [
    {
      invNumber: '',
      invDate: '',
      vendorName: '',
      invAmt: 0.0,
      invProd: 0,
      invPayType: '',
      invDesc: '',
      invType: '',
      invCurr: '',
    },
  ];

  constructor(
    private navCtrl: NavController,
    private router: Router,
    private route: ActivatedRoute,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) {
    this.route.queryParams.subscribe(() => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.mode = this.router.getCurrentNavigation().extras.state.mode;
      }
    });
    if (this.mode === 'create' || this.mode === 'new') {
      this.invoices = [];
      this.getAllInvoices();
    }
  }

  async ngOnInit() {
    (
      await this.loadingCtrl.create({
        message: 'Please Wait..',
        duration: 3000,
      })
    ).present();
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
    this.invoices = [];
    this.getAllInvoices();
  }

  async createInvoice() {
    (
      await this.alertCtrl.create({
        header: 'Info!',
        subHeader: 'Please select Type of Invoice.',
        buttons: [
          {
            text: 'Sales',
            role: 'submit',
            handler: () => {
              const navigateExtras: NavigationExtras = {
                state: {
                  source: 'sales',
                  editMode: false,
                },
              };
              this.navCtrl.navigateForward('/invoice-header', navigateExtras);
            },
          },
          {
            text: 'Purchase',
            role: 'submit',
            handler: () => {
              const navigateExtras: NavigationExtras = {
                state: {
                  source: 'purchase',
                  editMode: false,
                },
              };
              this.navCtrl.navigateForward('/invoice-header', navigateExtras);
            },
          },
        ],
      })
    ).present();
  }

  async getAllInvoices() {
    await this.firebase
      .firestore()
      .collection('invoices')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((docRecords) => {
          this.invoices.push({
            invNumber: docRecords.get('invNumber'),
            invDate: docRecords.get('invDate'),
            vendorName: docRecords.get('vendorName'),
            invAmt: docRecords.get('invAmt'),
            invProd: docRecords.get('invProd'),
            invPayType: docRecords.get('invPayType'),
            invDesc: docRecords.get('invDesc'),
            invType: docRecords.get('invType'),
            invCurr: docRecords.get('invCurr'),
          });
        });
      })
      .catch((e) => console.log(e));
  }

  async viewInvoice(invVal: any) {}

  handleInput(event) {
    this.items = Array.from(document.querySelectorAll('.invList'));
    const query = event.srcElement.value.toLowerCase();

    requestAnimationFrame(() => {
      this.items.forEach((item) => {
        const shouldShow = item.textContent.toLowerCase().indexOf(query) > -1;
        item.style.display = shouldShow ? 'block' : 'none';
      }, this);
    });
  }
}
