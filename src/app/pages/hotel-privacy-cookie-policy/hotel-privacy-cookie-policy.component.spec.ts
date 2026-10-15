import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelPrivacyCookiePolicyComponent } from './hotel-privacy-cookie-policy.component';

describe('HotelPrivacyCookiePolicyComponent', () => {
  let component: HotelPrivacyCookiePolicyComponent;
  let fixture: ComponentFixture<HotelPrivacyCookiePolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HotelPrivacyCookiePolicyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HotelPrivacyCookiePolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
