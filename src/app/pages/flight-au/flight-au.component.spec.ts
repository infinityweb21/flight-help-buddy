import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightAuComponent } from './flight-au.component';

describe('FlightAuComponent', () => {
  let component: FlightAuComponent;
  let fixture: ComponentFixture<FlightAuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlightAuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlightAuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
