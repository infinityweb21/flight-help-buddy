import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternationalFlightsComponent } from './international-flights.component';

describe('InternationalFlightsComponent', () => {
  let component: InternationalFlightsComponent;
  let fixture: ComponentFixture<InternationalFlightsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InternationalFlightsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InternationalFlightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
