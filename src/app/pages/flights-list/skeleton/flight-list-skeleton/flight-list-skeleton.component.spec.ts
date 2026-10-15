import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightListSkeletonComponent } from './flight-list-skeleton.component';

describe('FlightListSkeletonComponent', () => {
  let component: FlightListSkeletonComponent;
  let fixture: ComponentFixture<FlightListSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlightListSkeletonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlightListSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
