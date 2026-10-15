import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoutiqueHotelComponent } from './doutique-hotel.component';

describe('DoutiqueHotelComponent', () => {
  let component: DoutiqueHotelComponent;
  let fixture: ComponentFixture<DoutiqueHotelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoutiqueHotelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoutiqueHotelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
