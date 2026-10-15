import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightsToNewYorkCityComponent } from './flights-to-new-york-city.component';

describe('FlightsToNewYorkCityComponent', () => {
  let component: FlightsToNewYorkCityComponent;
  let fixture: ComponentFixture<FlightsToNewYorkCityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlightsToNewYorkCityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlightsToNewYorkCityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
