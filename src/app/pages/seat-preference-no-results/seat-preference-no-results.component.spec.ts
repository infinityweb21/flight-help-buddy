import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeatPreferenceNoResultsComponent } from './seat-preference-no-results.component';

describe('SeatPreferenceNoResultsComponent', () => {
  let component: SeatPreferenceNoResultsComponent;
  let fixture: ComponentFixture<SeatPreferenceNoResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeatPreferenceNoResultsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeatPreferenceNoResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
