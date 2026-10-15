import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelPaymentSkeletonComponent } from './hotel-payment-skeleton.component';

describe('HotelPaymentSkeletonComponent', () => {
  let component: HotelPaymentSkeletonComponent;
  let fixture: ComponentFixture<HotelPaymentSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HotelPaymentSkeletonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HotelPaymentSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
