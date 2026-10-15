import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitedAirlinesLosAngelesToOrlandoComponent } from './united-airlines-los-angeles-to-orlando.component';

describe('UnitedAirlinesLosAngelesToOrlandoComponent', () => {
  let component: UnitedAirlinesLosAngelesToOrlandoComponent;
  let fixture: ComponentFixture<UnitedAirlinesLosAngelesToOrlandoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnitedAirlinesLosAngelesToOrlandoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnitedAirlinesLosAngelesToOrlandoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
