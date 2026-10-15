import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitedAirlinesAustinToWashingtonDcComponent } from './united-airlines-austin-to-washington-dc.component';

describe('UnitedAirlinesAustinToWashingtonDcComponent', () => {
  let component: UnitedAirlinesAustinToWashingtonDcComponent;
  let fixture: ComponentFixture<UnitedAirlinesAustinToWashingtonDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnitedAirlinesAustinToWashingtonDcComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnitedAirlinesAustinToWashingtonDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
