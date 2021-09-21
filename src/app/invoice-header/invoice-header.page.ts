import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

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
  source = 'purchase';
  editMode: boolean;
  vendorSource: string;
  items: any;
  currencyMarker = false;
  invCalTotal = '';
  pageCnt: number;
  lastInvoice: string = null;
  lastProd: number = null;
  lastLines: any;

  invHead = {
    invNumber: '',
    invDate: '',
    vendorId: '',
    invAmt: 0.0,
    invProd: 0,
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
      productCode: '',
      purPrice: 0.0,
      lnQty: 0,
      lnAmt: '',
      lnCurr: '',
      gst: '',
    },
  ];

  sampleLine = {
    invNumber: '',
    lnNumber: 0,
    lnType: '',
    lnDesc: '',
    catCode: '',
    productCode: '',
    purPrice: 0.0,
    lnQty: 0,
    lnAmt: '',
    lnCurr: '',
    gst: '',
  };

  inVendor = [
    {
      vendorId: 0,
      vendorName: '',
    },
  ];

  inProducts = [
    {
      productCode: '',
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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toastCtrl: ToastController
  ) {
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
    this.pageView = 'header';
    this.pageCnt = -1;
    console.log('Page no ' + this.pageCnt);

    this.loadDummy();

    if (this.source === 'purchase') {
      this.vendorSource = 'supplier';
      this.invHead.invType = 'purchase';
    } else if (this.source === 'sales') {
      this.vendorSource = 'customer';
      this.invHead.invType = 'sales';
    }
  }

  onBack() {
    if (this.pageCnt === -1) {
      console.log('Exit Invoice');
      this.pageCnt -= 1;
    } else if (this.pageCnt === 0) {
      this.pageView = 'header';
      this.pageCnt -= 1;
    } else if (this.pageCnt > 0) {
      this.pageCnt -= 1;
    }
  }

  async onNextBtn() {
    if (this.pageCnt === -1) {
      this.setupConfig();
      this.pageCnt += 1;
      this.pageView = 'lines';
    } else if (this.pageCnt < this.invHead.invProd - 1) {
      this.pageCnt += 1;
    } else if (this.pageCnt === this.invHead.invProd - 1) {
      console.log('Summary Page...');
      this.invLines.forEach((element) => {
        console.log(element);
      });
    }

    // console.log(this.invHead);
    // if (
    //   this.invHead.invCurr.length === 0 ||
    //   this.invHead.invNumber.length === 0 ||
    //   this.invHead.vendorId.length === 0 ||
    //   this.invHead.invPayType.length === 0 ||
    //   this.invHead.invAmt === 0 ||
    //   this.invHead.invQty === 0
    // ) {
    //   (
    //     await this.toastCtrl.create({
    //       message: 'All Fields are mandatory..',
    //       duration: 3000,
    //     })
    //   ).present();
    // } else {
    //   this.pageView = 'lines';
    // }
  }

  setupConfig() {
    if (
      (this.lastInvoice === null && this.lastProd === null) ||
      this.lastInvoice !== this.invHead.invNumber
    ) {
      this.invLines = [];
      this.lastInvoice = this.invHead.invNumber;
      this.lastProd = this.invHead.invProd;
      this.invLinesSetup();
      this.lastLines = this.invLines;
    } else if (this.lastProd !== this.invHead.invProd) {
      this.invLines = [];
      this.invLinesSetup();
      for (let i = 0; i < Math.min(this.lastProd, this.invHead.invProd); i++) {
        this.invLines[i] = this.lastLines[i];
      }
    }
  }

  invLinesSetup() {
    this.invLines.length = this.invHead.invProd;
    for (let i = 0; i < this.invLines.length; i++) {
      this.invLines[i] = {
        invNumber: this.invHead.invNumber,
        lnNumber: i + 1,
        lnType: 'Items',
        lnDesc: '',
        catCode: '',
        productCode: '',
        purPrice: null,
        lnQty: null,
        lnAmt: '',
        lnCurr: this.invHead.invCurr,
        gst: '0',
      };
    }
  }

  calculateValue() {
    let lineGST: number;
    const subTotal =
      this.invLines[this.pageCnt].purPrice * this.invLines[this.pageCnt].lnQty;
    if (this.invLines[this.pageCnt].gst !== '') {
      lineGST = Number.parseInt(this.invLines[this.pageCnt].gst, 10);
    } else {
      lineGST = 0;
    }

    const lineTotal = subTotal + (subTotal * lineGST) / 100;

    this.invLines[this.pageCnt].lnAmt = lineTotal.toFixed(2);
  }

  loadDummy() {
    this.inVendor = [];
    this.inCategory = [];
    this.invHead = {
      invNumber: '',
      invDate: '',
      vendorId: '',
      invAmt: null,
      invProd: null,
      invPayType: '',
      invDesc: '',
      invType: '',
      invCurr: '',
    };

    // this.invHead = {
    //   invNumber: 'INV-0001',
    //   invDate: '2021-09-22T01:02:25.570+05:30',
    //   vendorId: '101',
    //   invAmt: 1000.0,
    //   invProd: 3,
    //   invPayType: 'UPI',
    //   invDesc: '',
    //   invType: '',
    //   invCurr: 'INR',
    // };

    this.inVendor = [
      {
        vendorId: 101,
        vendorName: 'No One Vendors',
      },
      {
        vendorId: 102,
        vendorName: 'Vendor 2',
      },
    ];

    this.sampleLine = {
      invNumber: 'INV-0001',
      lnNumber: 1,
      lnType: 'Items',
      lnDesc: 'Candy',
      catCode: 'A001',
      productCode: '10001',
      purPrice: null,
      lnQty: null,
      lnAmt: null,
      lnCurr: 'INR',
      gst: '0',
    };

    this.inCategory = [
      {
        catCode: 'A001',
        catDesc: 'Bada Bite',
      },
      {
        catCode: 'A002',
        catDesc: 'Family Pack',
      },
      {
        catCode: 'A003',
        catDesc: 'Cups',
      },
    ];

    this.inProducts = [
      {
        productCode: '10001',
        productName: 'Candy',
        catCode: 'A001',
        mrp: 30.0,
      },
      {
        productCode: '10002',
        productName: 'Vanilla',
        catCode: 'A002',
        mrp: 300.0,
      },
      {
        productCode: '10003',
        productName: 'Chocolate',
        catCode: 'A002',
        mrp: 350.0,
      },
    ];
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
