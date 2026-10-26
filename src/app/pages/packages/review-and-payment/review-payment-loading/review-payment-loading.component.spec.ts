import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewPaymentLoadingComponent } from './review-payment-loading.component';

describe('ReviewPaymentLoadingComponent', () => {
  let component: ReviewPaymentLoadingComponent;
  let fixture: ComponentFixture<ReviewPaymentLoadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewPaymentLoadingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewPaymentLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
