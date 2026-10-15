import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightsToDenverComponent } from './flights-to-denver.component';

describe('FlightsToDenverComponent', () => {
  let component: FlightsToDenverComponent;
  let fixture: ComponentFixture<FlightsToDenverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlightsToDenverComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlightsToDenverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
