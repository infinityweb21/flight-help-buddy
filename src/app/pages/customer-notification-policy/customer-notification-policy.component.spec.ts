import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerNotificationPolicyComponent } from './customer-notification-policy.component';

describe('CustomerNotificationPolicyComponent', () => {
  let component: CustomerNotificationPolicyComponent;
  let fixture: ComponentFixture<CustomerNotificationPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerNotificationPolicyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerNotificationPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
