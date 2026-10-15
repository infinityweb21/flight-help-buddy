import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightCancellationComponent } from './flight-cancellation.component';

describe('FlightCancellationComponent', () => {
  let component: FlightCancellationComponent;
  let fixture: ComponentFixture<FlightCancellationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlightCancellationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlightCancellationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
