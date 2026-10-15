import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightCaComponent } from './flight-ca.component';

describe('FlightCaComponent', () => {
  let component: FlightCaComponent;
  let fixture: ComponentFixture<FlightCaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlightCaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlightCaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
