import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundTripDealsComponent } from './round-trip-deals.component';

describe('RoundTripDealsComponent', () => {
  let component: RoundTripDealsComponent;
  let fixture: ComponentFixture<RoundTripDealsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoundTripDealsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoundTripDealsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
