import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InvoiceHeaderPage } from './invoice-header.page';

describe('InvoiceHeaderPage', () => {
  let component: InvoiceHeaderPage;
  let fixture: ComponentFixture<InvoiceHeaderPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceHeaderPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InvoiceHeaderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loads an invoice header without invalid date formatting', async () => {
    await component.getInvoiceHeader();
    expect(new Date(component.invHead.invDate).getTime()).not.toBeNaN();
  });
});
