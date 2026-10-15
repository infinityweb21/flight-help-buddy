import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightChangeComponent } from './flight-change.component';

describe('FlightChangeComponent', () => {
  let component: FlightChangeComponent;
  let fixture: ComponentFixture<FlightChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlightChangeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlightChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
