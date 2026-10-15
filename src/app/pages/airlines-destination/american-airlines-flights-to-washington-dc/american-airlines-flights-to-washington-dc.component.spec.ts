import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmericanAirlinesFlightsToWashingtonDcComponent } from './american-airlines-flights-to-washington-dc.component';

describe('AmericanAirlinesFlightsToWashingtonDcComponent', () => {
  let component: AmericanAirlinesFlightsToWashingtonDcComponent;
  let fixture: ComponentFixture<AmericanAirlinesFlightsToWashingtonDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AmericanAirlinesFlightsToWashingtonDcComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AmericanAirlinesFlightsToWashingtonDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
