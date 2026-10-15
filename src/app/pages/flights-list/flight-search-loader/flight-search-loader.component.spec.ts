import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightSearchLoaderComponent } from './flight-search-loader.component';

describe('FlightSearchLoaderComponent', () => {
  let component: FlightSearchLoaderComponent;
  let fixture: ComponentFixture<FlightSearchLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlightSearchLoaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlightSearchLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
