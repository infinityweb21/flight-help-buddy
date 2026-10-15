import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightUkComponent } from './flight-uk.component';

describe('FlightUkComponent', () => {
  let component: FlightUkComponent;
  let fixture: ComponentFixture<FlightUkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlightUkComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlightUkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
