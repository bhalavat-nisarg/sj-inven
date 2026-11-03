import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-receipts',
  templateUrl: './receipts.page.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./receipts.page.scss'],
})
export class ReceiptsPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
