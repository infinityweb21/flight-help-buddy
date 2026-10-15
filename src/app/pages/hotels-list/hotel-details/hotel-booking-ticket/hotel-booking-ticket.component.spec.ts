import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelBookingTicketComponent } from './hotel-booking-ticket.component';

describe('HotelBookingTicketComponent', () => {
  let component: HotelBookingTicketComponent;
  let fixture: ComponentFixture<HotelBookingTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HotelBookingTicketComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HotelBookingTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
