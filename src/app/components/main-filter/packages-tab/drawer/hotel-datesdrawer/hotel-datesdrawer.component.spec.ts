import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelDatesdrawerComponent } from './hotel-datesdrawer.component';

describe('HotelDatesdrawerComponent', () => {
  let component: HotelDatesdrawerComponent;
  let fixture: ComponentFixture<HotelDatesdrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HotelDatesdrawerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HotelDatesdrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
