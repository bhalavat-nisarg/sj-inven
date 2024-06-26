import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import {
  AlertController,
  LoadingController,
  NavController,
  ToastController,
} from '@ionic/angular';

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
  source = 'sales';
  editMode: boolean;
  vendorSource: string;
  items: any;
  invCalTotal = 0;
  gst05 = 0;
  gst12 = 0;
  gst18 = 0;
  pageCnt: number;
  lastInvoice: string = null;
  lastProd: number = null;
  lastLines: any;
  tender: number;
  tenderCh: number;
  inPayments = [];

  filterProducts = [
    {
      productCode: '',
      productName: '',
      catCode: '',
      mrp: 0.0,
    },
  ];

  invHead = {
    invNumber: '',
    invDate: '',
    vendorName: '',
    invAmt: 0.0,
    invProd: 0,
    invPayType: '',
    invDesc: '',
    invType: '',
    invCurr: 'INR',
    mobile: '',
  };

  invLines = [
    {
      invNumber: '',
      lnNumber: 0,
      lnType: '',
      catDesc: '',
      productName: '',
      purPrice: 0.0,
      lnQty: 0,
      lnAmt: '',
      lnCurr: '',
      gst: '',
      gstAmt: '',
      subTotal: '',
      productCode: '',
    },
  ];

  inVendor = [
    {
      vendorId: 0,
      vendorName: '',
      vendorMobile: null,
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
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController,
    private alertCtrl: AlertController
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
        // console.log(this.source + this.editMode);
      }
    });
  }

  async ngOnInit() {
    this.pageView = 'header';
    this.pageCnt = -1;
    // this.pageView = 'lines';
    // this.pageCnt = 0;
    // this.pageView = 'summary';
    // this.pageCnt = 2;

    // (
    //   await this.loadingCtrl.create({
    //     message: 'Please wait..',
    //     duration: 3000,
    //   })
    // ).present();

    if (this.source === 'purchase') {
      this.vendorSource = 'supplier';
      this.invHead.invType = 'purchase';
    } else if (this.source === 'sales') {
      this.vendorSource = 'customer';
      this.invHead.invType = 'sales';
    }
    // this.loadDummy();
    this.loadAllData();
  }

  onBack() {
    if (this.pageCnt === -1) {
      // console.log('Exit Invoice');
      this.pageCnt -= 1;

      const navigateExtras: NavigationExtras = {
        state: {
          mode: 'cancel',
        },
      };

      this.navCtrl.navigateBack('/invoices', navigateExtras);
    } else if (this.pageCnt === 0) {
      this.pageView = 'header';
      this.pageCnt -= 1;
    } else if (this.pageCnt > 0) {
      this.pageCnt -= 1;
      this.pageView = 'lines';
    }
  }

  async onNextBtn() {
    if (
      this.invHead.invCurr.length === 0 ||
      this.invHead.invNumber.length === 0 ||
      this.invHead.vendorName.length === 0 ||
      this.invHead.invPayType.length === 0 ||
      this.invHead.invProd === null ||
      this.invHead.mobile.length === 0
    ) {
      (
        await this.toastCtrl.create({
          message: 'All Fields are mandatory..',
          duration: 3000,
        })
      ).present();
    } else if (this.invHead.mobile.length < 10) {
      (
        await this.toastCtrl.create({
          message: 'Invalid Mobile number..',
          duration: 3000,
        })
      ).present();
    } else if (this.invHead.invProd < 1) {
      (
        await this.toastCtrl.create({
          message: 'Invalid Product number..',
          duration: 3000,
        })
      ).present();
    } else {
      if (this.pageCnt === -1) {
        this.setupConfig();
        this.pageCnt += 1;
        this.pageView = 'lines';
      } else if (this.pageCnt < this.invHead.invProd - 1) {
        if (
          this.invLines[this.pageCnt].catDesc.length === 0 ||
          this.invLines[this.pageCnt].productName.length === 0 ||
          this.invLines[this.pageCnt].purPrice === null ||
          this.invLines[this.pageCnt].lnQty === null
        ) {
          (
            await this.toastCtrl.create({
              message: 'All Fields are mandatory..',
              duration: 3000,
            })
          ).present();
        } else {
          this.pageCnt += 1;
        }
      } else if (this.pageCnt === this.invHead.invProd - 1) {
        if (
          this.invLines[this.pageCnt].catDesc.length === 0 ||
          this.invLines[this.pageCnt].productName.length === 0 ||
          this.invLines[this.pageCnt].purPrice === null ||
          this.invLines[this.pageCnt].lnQty === null
        ) {
          (
            await this.toastCtrl.create({
              message: 'All Fields are mandatory..',
              duration: 3000,
            })
          ).present();
        } else {
          if (
            this.invHead.invPayType === 'Cash' &&
            this.invHead.invType === 'sales'
          ) {
            this.calculateSummary();
            (
              await this.alertCtrl.create({
                header: 'Cash Total',
                subHeader: 'Amount Paid by Customer?',
                message: `Total Bill: ₹ ` + this.invCalTotal.toFixed(2),
                inputs: [
                  {
                    type: 'number',
                    value: null,
                    placeholder: `₹ ` + this.invCalTotal.toFixed(2),
                  },
                ],
                buttons: [
                  {
                    text: 'cancel',
                    role: 'cancel',
                  },
                  {
                    text: 'next',
                    role: 'submit',
                    handler: (data) => {
                      this.tender = data[0];
                      this.tenderCh = this.invCalTotal - this.tender;
                      this.pageCnt += 1;
                      this.pageView = 'summary';
                    },
                  },
                ],
              })
            ).present();
          } else {
            this.pageCnt += 1;
            this.pageView = 'summary';
          }
        }
      } else if (
        this.pageCnt === this.invHead.invProd &&
        this.pageView === 'summary'
      ) {
        (
          await this.loadingCtrl.create({
            message: 'Please wait..',
            duration: 3000,
          })
        ).present();
        this.loadInvoiceHeader();
        this.loadInvoiceLines();
        console.log(this.invLines);
        // this.decrementInven(this.invLines[0]);
      }
    }
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
        catDesc: '',
        productName: '',
        purPrice: null,
        lnQty: null,
        lnAmt: '',
        lnCurr: this.invHead.invCurr,
        gst: '0',
        gstAmt: '0.00',
        subTotal: '',
        productCode: '',
      };
    }
  }

  calculateValue() {
    let lineGST: number;
    const subTot =
      this.invLines[this.pageCnt].purPrice * this.invLines[this.pageCnt].lnQty;
    if (this.invLines[this.pageCnt].gst !== '') {
      lineGST = Number.parseInt(this.invLines[this.pageCnt].gst, 10);
    } else {
      lineGST = 0;
    }

    const lineTotal = subTot + (subTot * lineGST) / 100;

    this.invLines[this.pageCnt].gstAmt = ((subTot * lineGST) / 100).toFixed(2);
    this.invLines[this.pageCnt].subTotal = subTot.toFixed(2);
    this.invLines[this.pageCnt].lnAmt = lineTotal.toFixed(2);
  }

  calculateSummary() {
    this.invCalTotal = 0;
    this.gst05 = 0;
    this.gst12 = 0;
    this.gst18 = 0;

    // eslint-disable-next-line prefer-const
    for (let line of this.invLines) {
      this.invCalTotal += Number.parseFloat(line.lnAmt);

      if (line.gst === '5') {
        this.gst05 += Number.parseFloat(line.subTotal) * 0.05;
      } else if (line.gst === '12') {
        this.gst12 += Number.parseFloat(line.subTotal) * 0.12;
      } else if (line.gst === '18') {
        this.gst18 += Number.parseFloat(line.subTotal) * 0.18;
      }
    }
  }

  getFilterProducts(catg: any) {
    this.filterProducts = [];
    let code: string;

    this.inCategory.forEach((val) => {
      if (val.catDesc === catg) {
        code = val.catCode;
      }
    });
    // console.log(code);
    this.filterProducts = this.inProducts.filter((e) => e.catCode === code);
    // console.log(this.filterProducts);
  }

  loadAllData() {
    this.inVendor = [];
    this.inCategory = [];
    this.inProducts = [];

    this.inPayments = ['Cash', 'UPI', 'Credit/Debit Card'];

    this.getAllVendors();
    this.getAllCategory();
    this.getAllProducts();

    this.invHead = {
      invNumber: null,
      invDate: null,
      vendorName: null,
      invAmt: null,
      invProd: null,
      invPayType: null,
      invDesc: null,
      invType: null,
      invCurr: 'INR',
      mobile: null,
    };

    this.invLines = [
      {
        invNumber: null,
        lnNumber: null,
        lnType: null,
        catDesc: null,
        productName: null,
        purPrice: null,
        lnQty: null,
        lnAmt: null,
        lnCurr: null,
        gst: null,
        gstAmt: null,
        subTotal: null,
        productCode: null,
      },
    ];

    this.getInvoiceHeader();

    if (this.source === 'purchase') {
      this.vendorSource = 'supplier';
      this.invHead.invType = 'purchase';
    } else if (this.source === 'sales') {
      this.vendorSource = 'customer';
      this.invHead.invType = 'sales';
    }
  }

  loadDummy() {
    this.inVendor = [];
    this.inCategory = [];
    this.inProducts = [];

    // this.invHead = {
    //   invNumber: '',
    //   invDate: '',
    //   vendorName: '',
    //   invAmt: null,
    //   invProd: null,
    //   invPayType: '',
    //   invDesc: '',
    //   invType: '',
    //   invCurr: '',
    //   mobile: ''
    // };

    this.getAllProducts();

    this.invHead = {
      invNumber: 'INV-0001',
      invDate: '2021-09-22T01:02:25.570+05:30',
      vendorName: 'Vendor 2',
      invAmt: 829.5,
      invProd: 2,
      invPayType: 'UPI',
      invDesc: '',
      invType: 'Purchase',
      invCurr: 'INR',
      mobile: '',
    };

    this.inVendor = [
      {
        vendorId: 101,
        vendorName: 'No One Vendors',
        vendorMobile: '99999XXXXX',
      },
      {
        vendorId: 102,
        vendorName: 'Vendor 2',
        vendorMobile: '99999XXXXX',
      },
    ];

    this.invLines = [
      {
        invNumber: 'INV-0001',
        lnNumber: 1,
        lnType: 'Items',
        catDesc: 'Cups',
        productName: 'Vanilla',
        purPrice: 30.0,
        lnQty: 5,
        lnAmt: '150.00',
        lnCurr: 'INR',
        gst: '0',
        gstAmt: '0.00',
        subTotal: '150.00',
        productCode: '',
      },
      {
        invNumber: 'INV-0001',
        lnNumber: 2,
        lnType: 'Items',
        catDesc: 'Family Pack',
        productName: 'Chocolate',
        purPrice: 60.0,
        lnQty: 10,
        lnAmt: '708.00',
        lnCurr: 'INR',
        gst: '0',
        gstAmt: '0.00',
        subTotal: '708.00',
        productCode: '',
      },
    ];

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

    this.getInvoiceHeader();

    // this.inProducts = [
    //   {
    //     productCode: '10001',
    //     productName: 'Candy',
    //     catCode: 'A001',
    //     mrp: 30.0,
    //   },
    //   {
    //     productCode: '10002',
    //     productName: 'Vanilla',
    //     catCode: 'A002',
    //     mrp: 300.0,
    //   },
    //   {
    //     productCode: '10003',
    //     productName: 'Chocolate',
    //     catCode: 'A002',
    //     mrp: 350.0,
    //   },
    // ];
  }

  getMobileNumber(event) {
    // console.log(event);
    const vendors = this.inVendor.reduce((map, obj) => {
      map[obj.vendorName] = obj.vendorMobile;
      return map;
    }, []);

    this.invHead.mobile = vendors[event];

    if (event === 'Others') {
      this.inPayments = [];
      this.invHead.invPayType = null;
      this.inPayments = ['Cash', 'UPI', 'Credit/Debit Card'];
    } else {
      this.inPayments = [];
      this.invHead.invPayType = null;
      this.inPayments = [
        'Cheque',
        'NEFT/IMPS',
        'Cash',
        'UPI',
        'Credit/Debit Card',
      ];
    }
  }

  getProductPrice(event) {
    const product = this.inProducts.reduce((map, obj) => {
      map[obj.productName] = [obj.mrp, obj.productCode];
      return map;
    }, []);
    console.log(product[event]);

    this.invLines[this.pageCnt].purPrice = product[event][0];
    this.invLines[this.pageCnt].productCode = product[event][1];
  }

  async getInvoiceHeader() {
    const invoiceType = this.source + '-invoice';
    // console.log(invoiceType);

    this.invHead.invDate = null;
    const date = formatDate(new Date(), 'YYYY-MM-ddTHH:mm:ss.sssTZ', 'en');
    // console.log(date);
    this.invHead.invDate = new Date().toString();

    await this.firebase
      .firestore()
      .collection('counters')
      .doc(invoiceType)
      .get()
      .then((query) => {
        this.invHead.invNumber = query.get('counter');
        // console.log(query.get('counter'));
      })
      .catch((e) => console.log(e));
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
            vendorMobile: docRecords.get('mobile'),
          });
        });
        if (this.vendorSource === 'customer') {
          this.inVendor.push({
            vendorId: Number.parseFloat(
              this.firebase.firestore.Timestamp.now().valueOf()
            ),
            vendorName: 'Others',
            vendorMobile: null,
          });
          this.invHead.vendorName = 'Others';
        }
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
            productCode: docRecords.get('productCode'),
            productName: docRecords.get('productName'),
            catCode: docRecords.get('catCode'),
            mrp: docRecords.get('mrp'),
          });
        });
      })
      .catch((error) => console.log(error));
  }

  async loadInvoiceHeader() {
    await this.firebase
      .firestore()
      .collection('invoices')
      .add({
        invNumber: this.invHead.invNumber,
        invDate: this.invHead.invDate,
        vendorName: this.invHead.vendorName,
        invAmt: this.invHead.invAmt,
        invProd: this.invHead.invProd,
        invPayType: this.invHead.invPayType,
        invDesc: this.invHead.invDesc,
        invType: this.invHead.invType,
        invCurr: this.invHead.invCurr,
      })
      .catch((e) => console.log(e));
  }

  async loadInvoiceLines() {
    // eslint-disable-next-line prefer-const
    for (let lines of this.invLines) {
      await this.firebase
        .firestore()
        .collection('invoice-lines')
        .add({
          invNumber: lines.invNumber,
          lnNumber: lines.lnNumber,
          lnType: lines.lnType,
          catDesc: lines.catDesc,
          productName: lines.productName,
          purPrice: lines.purPrice,
          lnQty: lines.lnQty,
          lnAmt: lines.lnAmt,
          lnCurr: lines.lnCurr,
          gst: lines.gst,
          gstAmt: lines.gstAmt,
          subTotal: lines.subTotal,
        })
        .then(() => {
          if (this.invHead.invType === 'sales') {
            this.decrementInven(lines);
          } else if (this.invHead.invType === 'purchase') {
            this.incrementInven(lines);
          }
        })
        .catch((e) => console.log(e));
    }
    const navigateExtras: NavigationExtras = {
      state: {
        mode: 'create',
      },
    };

    this.navCtrl.navigateBack('/invoices', navigateExtras);
  }

  incrementInven(lines) {
    this.firebase
      .firestore()
      .collection('products')
      .where('productCode', '==', lines.productCode)
      .get()
      .then((query) => {
        query.forEach((rec) => {
          this.firebase
            .firestore()
            .collection('products')
            .doc(rec.id)
            .update({
              qty: this.firebase.firestore.FieldValue.increment(lines.lnQty),
            })
            .catch((e) => console.error(e));
        });
      })
      .catch((e) => console.log(e));
  }

  decrementInven(lines) {
    this.firebase
      .firestore()
      .collection('products')
      .where('productCode', '==', lines.productCode)
      .get()
      .then((query) => {
        query.forEach((rec) => {
          this.firebase
            .firestore()
            .collection('products')
            .doc(rec.id)
            .update({
              qty: this.firebase.firestore.FieldValue.increment(-lines.lnQty),
            })
            .catch((e) => console.error(e));
        });
      })
      .catch((e) => console.log(e));
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
