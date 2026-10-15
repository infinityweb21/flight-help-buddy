import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightsToSanFranciscoComponent } from './flights-to-san-francisco.component';

describe('FlightsToSanFranciscoComponent', () => {
  let component: FlightsToSanFranciscoComponent;
  let fixture: ComponentFixture<FlightsToSanFranciscoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlightsToSanFranciscoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlightsToSanFranciscoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
