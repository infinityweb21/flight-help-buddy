import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelBookingPaymentComponent } from './hotel-booking-payment.component';

describe('HotelBookingPaymentComponent', () => {
  let component: HotelBookingPaymentComponent;
  let fixture: ComponentFixture<HotelBookingPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HotelBookingPaymentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HotelBookingPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
