import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightDownloadTicketComponent } from './flight-download-ticket.component';

describe('FlightDownloadTicketComponent', () => {
  let component: FlightDownloadTicketComponent;
  let fixture: ComponentFixture<FlightDownloadTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlightDownloadTicketComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlightDownloadTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
