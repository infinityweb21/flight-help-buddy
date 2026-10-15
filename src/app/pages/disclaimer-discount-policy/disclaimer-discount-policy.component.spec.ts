import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisclaimerDiscountPolicyComponent } from './disclaimer-discount-policy.component';

describe('DisclaimerDiscountPolicyComponent', () => {
  let component: DisclaimerDiscountPolicyComponent;
  let fixture: ComponentFixture<DisclaimerDiscountPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisclaimerDiscountPolicyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisclaimerDiscountPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
