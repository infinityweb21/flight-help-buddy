import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmericanAirlinesClevelandToAtlantaComponent } from './american-airlines-cleveland-to-atlanta.component';

describe('AmericanAirlinesClevelandToAtlantaComponent', () => {
  let component: AmericanAirlinesClevelandToAtlantaComponent;
  let fixture: ComponentFixture<AmericanAirlinesClevelandToAtlantaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AmericanAirlinesClevelandToAtlantaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AmericanAirlinesClevelandToAtlantaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
