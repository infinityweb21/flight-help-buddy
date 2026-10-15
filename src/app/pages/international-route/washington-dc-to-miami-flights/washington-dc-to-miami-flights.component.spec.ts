import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WashingtonDcToMiamiFlightsComponent } from './washington-dc-to-miami-flights.component';

describe('WashingtonDcToMiamiFlightsComponent', () => {
  let component: WashingtonDcToMiamiFlightsComponent;
  let fixture: ComponentFixture<WashingtonDcToMiamiFlightsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WashingtonDcToMiamiFlightsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WashingtonDcToMiamiFlightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
