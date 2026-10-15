import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmericanAirlinesLosAngelesToAtlantaComponent } from './american-airlines-los-angeles-to-atlanta.component';

describe('AmericanAirlinesLosAngelesToAtlantaComponent', () => {
  let component: AmericanAirlinesLosAngelesToAtlantaComponent;
  let fixture: ComponentFixture<AmericanAirlinesLosAngelesToAtlantaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AmericanAirlinesLosAngelesToAtlantaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AmericanAirlinesLosAngelesToAtlantaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
