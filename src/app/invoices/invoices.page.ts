import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.page.html',
  styleUrls: ['./invoices.page.scss'],
})
export class InvoicesPage implements OnInit {
  constructor(private navCtrl: NavController) {}

  ngOnInit() {}

  createInvoice() {
    this.navCtrl.navigateForward('/invoice-header');
  }
}
