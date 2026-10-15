import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DallasToNewYorkCityFlightsComponent } from './dallas-to-new-york-city-flights.component';

describe('DallasToNewYorkCityFlightsComponent', () => {
  let component: DallasToNewYorkCityFlightsComponent;
  let fixture: ComponentFixture<DallasToNewYorkCityFlightsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DallasToNewYorkCityFlightsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DallasToNewYorkCityFlightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
