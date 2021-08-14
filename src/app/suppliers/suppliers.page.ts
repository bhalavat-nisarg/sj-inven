import { Component, OnInit } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.page.html',
  styleUrls: ['./suppliers.page.scss'],
})
export class SuppliersPage implements OnInit {
  viewEdit: boolean;
  suppliers = [
    {
      vendorId: 0,
      vendorName: '',
      address1: '',
      address2: '',
      address3: '',
      city: '',
      state: '',
      country: '',
      pincode: '',
      description: '',
      status: '',
      createdBy: '',
      createDate: '',
      lastUpdateDate: '',
      lastUpdatedBy: '',
    },
  ];

  constructor(private navCtrl: NavController) {}

  ngOnInit() {
    this.suppliers = [];
    this.viewEdit = false;
    this.loadDummy();
  }

  toVendor(supplier: any) {
    const navigateExtras: NavigationExtras = {
      state: {
        vendor: supplier,
      },
    };

    this.navCtrl.navigateForward('/vendor', navigateExtras);
  }

  addNewSuppliers() {
    this.viewEdit = true;
  }

  cancelSupplier() {
    this.viewEdit = false;
  }

  loadDummy() {
    this.suppliers = [
      {
        vendorId: 10001,
        vendorName: 'Dummy Supplier',
        address1: '1, Chamber Line',
        address2: '',
        address3: '',
        city: 'Vadodara',
        state: 'Gujarat',
        country: 'India',
        pincode: '390019',
        status: 'Active',
        description: '',
        createdBy: '-1',
        createDate: '1 Aug 2021',
        lastUpdateDate: '-1',
        lastUpdatedBy: '1 Aug 2021',
      },
    ];
  }
}
