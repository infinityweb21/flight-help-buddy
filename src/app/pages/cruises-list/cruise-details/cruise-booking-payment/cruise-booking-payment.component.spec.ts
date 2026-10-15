import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CruiseBookingPaymentComponent } from './cruise-booking-payment.component';

describe('CruiseBookingPaymentComponent', () => {
  let component: CruiseBookingPaymentComponent;
  let fixture: ComponentFixture<CruiseBookingPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CruiseBookingPaymentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CruiseBookingPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
