import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightPaymentSkeletonComponent } from './flight-payment-skeleton.component';

describe('FlightPaymentSkeletonComponent', () => {
  let component: FlightPaymentSkeletonComponent;
  let fixture: ComponentFixture<FlightPaymentSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlightPaymentSkeletonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlightPaymentSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
