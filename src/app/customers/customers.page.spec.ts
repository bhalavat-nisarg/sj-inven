import { provideZoneChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CustomersPage } from './customers.page';

describe('CustomersPage', () => {
  let component: CustomersPage;
  let fixture: ComponentFixture<CustomersPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomersPage ],
      imports: [IonicModule.forRoot()],
      providers: [provideZoneChangeDetection()]
    }).compileComponents();

    fixture = TestBed.createComponent(CustomersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('updates the empty state when customers change outside template events', async () => {
    fixture.autoDetectChanges();
    component.customers = [];
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('No Customers to Show');

    fixture.ngZone.run(() => component.loadDummy());
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).not.toContain('No Customers to Show');
    expect(fixture.nativeElement.textContent).toContain('Total 1 Customers');
    expect(fixture.nativeElement.querySelectorAll('.custList').length).toBe(1);

    fixture.ngZone.run(() => { component.customers = []; });
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelectorAll('.custList').length).toBe(0);
    expect(fixture.nativeElement.textContent).toContain('No Customers to Show');
  });

  it('renders each customer status and keeps the selected customer navigation', () => {
    component.loadDummy();
    component.customers.push({
      ...component.customers[0],
      vendorId: 10002,
      vendorName: 'Inactive Customer',
      status: 'Inactive',
    });
    fixture.detectChanges();

    const rows = fixture.nativeElement.querySelectorAll('.custList');
    expect(rows.length).toBe(2);
    expect(rows[0].textContent).toContain('Dummy Customer');
    expect(rows[0].querySelector('[name="ban-outline"]')).toBeNull();
    expect(rows[1].textContent).toContain('Inactive Customer');
    expect(rows[1].querySelector('[name="ban-outline"]')).not.toBeNull();

    const navigate = spyOn(component, 'toVendor');
    rows[1].querySelector('ion-item').click();
    expect(navigate).toHaveBeenCalledWith(component.customers[1]);
  });
});
