import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitedAirlinesFlightsToChicagoComponent } from './united-airlines-flights-to-chicago.component';

describe('UnitedAirlinesFlightsToChicagoComponent', () => {
  let component: UnitedAirlinesFlightsToChicagoComponent;
  let fixture: ComponentFixture<UnitedAirlinesFlightsToChicagoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnitedAirlinesFlightsToChicagoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnitedAirlinesFlightsToChicagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
