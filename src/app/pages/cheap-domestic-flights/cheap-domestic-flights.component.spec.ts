import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheapDomesticFlightsComponent } from './cheap-domestic-flights.component';

describe('CheapDomesticFlightsComponent', () => {
  let component: CheapDomesticFlightsComponent;
  let fixture: ComponentFixture<CheapDomesticFlightsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheapDomesticFlightsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheapDomesticFlightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
