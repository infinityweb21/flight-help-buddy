import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightFilterModalComponent } from './flight-filter-modal.component';

describe('FlightFilterModalComponent', () => {
  let component: FlightFilterModalComponent;
  let fixture: ComponentFixture<FlightFilterModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlightFilterModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlightFilterModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
