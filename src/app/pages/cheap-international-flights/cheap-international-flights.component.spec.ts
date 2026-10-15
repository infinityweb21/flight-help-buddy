import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheapInternationalFlightsComponent } from './cheap-international-flights.component';

describe('CheapInternationalFlightsComponent', () => {
  let component: CheapInternationalFlightsComponent;
  let fixture: ComponentFixture<CheapInternationalFlightsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheapInternationalFlightsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheapInternationalFlightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
