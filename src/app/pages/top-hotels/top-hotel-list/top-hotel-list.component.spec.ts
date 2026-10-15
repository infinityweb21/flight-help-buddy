import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopHotelListComponent } from './top-hotel-list.component';

describe('TopHotelListComponent', () => {
  let component: TopHotelListComponent;
  let fixture: ComponentFixture<TopHotelListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopHotelListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopHotelListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
