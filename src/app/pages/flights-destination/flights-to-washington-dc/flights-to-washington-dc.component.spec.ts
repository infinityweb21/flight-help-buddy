import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightsToWashingtonDcComponent } from './flights-to-washington-dc.component';

describe('FlightsToWashingtonDcComponent', () => {
  let component: FlightsToWashingtonDcComponent;
  let fixture: ComponentFixture<FlightsToWashingtonDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlightsToWashingtonDcComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlightsToWashingtonDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
