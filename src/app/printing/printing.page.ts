import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-printing',
  templateUrl: './printing.page.html',
  styleUrls: ['./printing.page.scss'],
})
export class PrintingPage implements OnInit {
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
    },
  ];

  subTotal = 858.0;
  roundOff = 0.0;
  discount = 0.0;
  gstAmt = 0.0;

  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.queryParams.subscribe(() => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.invHead = this.router.getCurrentNavigation().extras.state.invHead;
        console.log(this.router.getCurrentNavigation().extras.state.invHead);
      }
    });
  }

  ngOnInit() {
    this.loadDummy();
  }

  onCancel() {
    this.navCtrl.navigateBack('/invoices');
  }

  loadDummy() {
    // this.invHead = {
    //   invNumber: 'INV-0001',
    //   invDate: '2021-09-22T13:02:25.570+05:30',
    //   vendorName: 'Vendor 2',
    //   invAmt: 829.5,
    //   invProd: 2,
    //   invPayType: 'UPI',
    //   invDesc: '',
    //   invType: 'Purchase',
    //   invCurr: 'INR',
    //   mobile: '98XXX XXXXX',
    // };

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
      },
    ];
  }
}
