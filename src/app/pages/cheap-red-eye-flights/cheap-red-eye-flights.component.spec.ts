import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheapRedEyeFlightsComponent } from './cheap-red-eye-flights.component';

describe('CheapRedEyeFlightsComponent', () => {
  let component: CheapRedEyeFlightsComponent;
  let fixture: ComponentFixture<CheapRedEyeFlightsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheapRedEyeFlightsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheapRedEyeFlightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
