import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllegiantAirFlightsToTampaComponent } from './allegiant-air-flights-to-tampa.component';

describe('AllegiantAirFlightsToTampaComponent', () => {
  let component: AllegiantAirFlightsToTampaComponent;
  let fixture: ComponentFixture<AllegiantAirFlightsToTampaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllegiantAirFlightsToTampaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllegiantAirFlightsToTampaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
