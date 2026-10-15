import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightCommonSkeletonComponent } from './flight-common-skeleton.component';

describe('FlightCommonSkeletonComponent', () => {
  let component: FlightCommonSkeletonComponent;
  let fixture: ComponentFixture<FlightCommonSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlightCommonSkeletonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlightCommonSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
