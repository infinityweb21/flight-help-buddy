import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DomesticFlightsComponent } from './domestic-flights.component';

describe('DomesticFlightsComponent', () => {
  let component: DomesticFlightsComponent;
  let fixture: ComponentFixture<DomesticFlightsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DomesticFlightsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DomesticFlightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
