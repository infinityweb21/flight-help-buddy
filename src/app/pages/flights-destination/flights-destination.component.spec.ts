import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightsDestinationComponent } from './flights-destination.component';

describe('FlightsDestinationComponent', () => {
  let component: FlightsDestinationComponent;
  let fixture: ComponentFixture<FlightsDestinationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlightsDestinationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlightsDestinationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
