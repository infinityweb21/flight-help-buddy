import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupFlightBookingDiscountComponent } from './group-flight-booking-discount.component';

describe('GroupFlightBookingDiscountComponent', () => {
  let component: GroupFlightBookingDiscountComponent;
  let fixture: ComponentFixture<GroupFlightBookingDiscountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupFlightBookingDiscountComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupFlightBookingDiscountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
