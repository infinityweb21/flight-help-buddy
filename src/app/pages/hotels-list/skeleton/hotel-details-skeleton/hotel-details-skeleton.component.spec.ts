import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelDetailsSkeletonComponent } from './hotel-details-skeleton.component';

describe('HotelDetailsSkeletonComponent', () => {
  let component: HotelDetailsSkeletonComponent;
  let fixture: ComponentFixture<HotelDetailsSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HotelDetailsSkeletonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HotelDetailsSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
