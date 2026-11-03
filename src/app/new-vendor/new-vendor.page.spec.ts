import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NewVendorPage } from './new-vendor.page';

describe('NewVendorPage', () => {
  let component: NewVendorPage;
  let fixture: ComponentFixture<NewVendorPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewVendorPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NewVendorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
