import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import * as Firebase from 'firebase/app';
import 'firebase/firestore';

@Component({
  selector: 'app-invoice-header',
  templateUrl: './invoice-header.page.html',
  styleUrls: ['./invoice-header.page.scss'],
})
export class InvoiceHeaderPage implements OnInit {
  firebase = Firebase.default;

  pageView = 'header';
  source: 'purchase';
  editMode: boolean;
  vendorSource: string;
  items: any;

  invHead = {
    invNumber: '',
    invDate: '',
    vendorId: 0,
    invAmt: 0.0,
    invQty: 0,
    invPayType: '',
    invDesc: '',
    invType: '',
    invCurr: '',
  };

  invLines = [
    {
      invNumber: '',
      lnNumber: 0,
      lnType: '',
      lnDesc: '',
      catCode: '',
      productCode: 0,
      purPrice: 0.0,
      lnQty: 0,
      lnAmt: 0.0,
      lnCurr: '',
    },
  ];

  inVendor = [
    {
      vendorId: 0,
      vendorName: 'No One Vendors',
    },
    {
      vendorId: 1,
      vendorName: 'Vendor 2',
    },
  ];

  inProducts = [
    {
      productCode: 0,
      productName: '',
      catCode: '',
      mrp: 0.0,
    },
  ];

  inCategory = [
    {
      catCode: '',
      catDesc: '',
    },
  ];

  constructor(private route: ActivatedRoute, private router: Router) {
    this.route.queryParams.subscribe(() => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.source = this.router.getCurrentNavigation().extras.state.source;
        this.editMode =
          this.router.getCurrentNavigation().extras.state.editMode;
        // if (this.editMode) {
        //   this.inVendor =
        //     this.router.getCurrentNavigation().extras.state.viewVendor;
        // }
      }
    });
  }

  ngOnInit() {
    if (this.source === 'purchase') {
      this.vendorSource = 'supplier';
      this.invHead.invType = 'purchase';
    } else if (this.source === 'sales') {
      this.vendorSource = 'customer';
      this.invHead.invType = 'sales';
    }
  }

  onCancel() {}

  onNextBtn() {
    console.log(this.invHead);
  }

  async getAllVendors() {
    await this.firebase
      .firestore()
      .collection('vendors')
      .where('vendorType', '==', this.vendorSource)
      .where('status', '==', 'Active')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((docRecords) => {
          this.inVendor.push({
            vendorId: docRecords.get('vendorId'),
            vendorName: docRecords.get('vendorName'),
          });
        });
      })
      .catch((error) => console.log(error));
  }

  async getAllCategory() {
    await this.firebase
      .firestore()
      .collection('category')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((docRecords) => {
          this.inCategory.push({
            catCode: docRecords.get('catCode'),
            catDesc: docRecords.get('catDesc'),
          });
        });
      })
      .catch((error) => console.log(error));
  }

  async getAllProducts() {
    await this.firebase
      .firestore()
      .collection('products')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((docRecords) => {
          this.inProducts.push({
            productCode: docRecords.get('productCOde'),
            productName: docRecords.get('productName'),
            catCode: docRecords.get('catCode'),
            mrp: docRecords.get('mrp'),
          });
        });
      })
      .catch((error) => console.log(error));
  }

  handleInput(event) {
    this.items = Array.from(this.inProducts);
    const query = event.srcElement.value.toLowerCase();

    requestAnimationFrame(() => {
      this.items.forEach((item) => {
        const shouldShow = item.textContent.toLowerCase().indexOf(query) > -1;
        item.style.display = shouldShow ? 'block' : 'none';
      }, this);
    });
  }
}
