import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewAndPaymentComponent } from './review-and-payment.component';

describe('ReviewAndPaymentComponent', () => {
  let component: ReviewAndPaymentComponent;
  let fixture: ComponentFixture<ReviewAndPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewAndPaymentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewAndPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
