import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelSearchLoaderComponent } from './hotel-search-loader.component';

describe('HotelSearchLoaderComponent', () => {
  let component: HotelSearchLoaderComponent;
  let fixture: ComponentFixture<HotelSearchLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HotelSearchLoaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HotelSearchLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
