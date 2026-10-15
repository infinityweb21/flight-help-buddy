import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingInProgressComponent } from './booking-in-progress.component';

describe('BookingInProgressComponent', () => {
  let component: BookingInProgressComponent;
  let fixture: ComponentFixture<BookingInProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingInProgressComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingInProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
