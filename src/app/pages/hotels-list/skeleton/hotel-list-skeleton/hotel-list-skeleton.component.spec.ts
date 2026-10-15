import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelListSkeletonComponent } from './hotel-list-skeleton.component';

describe('HotelListSkeletonComponent', () => {
  let component: HotelListSkeletonComponent;
  let fixture: ComponentFixture<HotelListSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HotelListSkeletonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HotelListSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
