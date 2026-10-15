import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrontierAirlinesFlightsToChicagoComponent } from './frontier-airlines-flights-to-chicago.component';

describe('FrontierAirlinesFlightsToChicagoComponent', () => {
  let component: FrontierAirlinesFlightsToChicagoComponent;
  let fixture: ComponentFixture<FrontierAirlinesFlightsToChicagoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FrontierAirlinesFlightsToChicagoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FrontierAirlinesFlightsToChicagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
