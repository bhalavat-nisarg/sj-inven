import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MyAccountPage } from './myaccount.page';

describe('myaccountPage', () => {
  let component: MyAccountPage;
  let fixture: ComponentFixture<MyAccountPage>;

  beforeEach(
    async () => {
      await TestBed.configureTestingModule({
        declarations: [MyAccountPage],
        imports: [IonicModule.forRoot()],
      }).compileComponents();

      fixture = TestBed.createComponent(MyAccountPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    }
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
