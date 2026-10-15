import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TampaToKnoxvilleFlightsComponent } from './tampa-to-knoxville-flights.component';

describe('TampaToKnoxvilleFlightsComponent', () => {
  let component: TampaToKnoxvilleFlightsComponent;
  let fixture: ComponentFixture<TampaToKnoxvilleFlightsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TampaToKnoxvilleFlightsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TampaToKnoxvilleFlightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
