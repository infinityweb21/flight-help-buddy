import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelFilterModalComponent } from './hotel-filter-modal.component';

describe('HotelFilterModalComponent', () => {
  let component: HotelFilterModalComponent;
  let fixture: ComponentFixture<HotelFilterModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HotelFilterModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HotelFilterModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
