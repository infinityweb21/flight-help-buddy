import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivacyNoticeCaliforniaComponent } from './privacy-notice-california.component';

describe('PrivacyNoticeCaliforniaComponent', () => {
  let component: PrivacyNoticeCaliforniaComponent;
  let fixture: ComponentFixture<PrivacyNoticeCaliforniaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrivacyNoticeCaliforniaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrivacyNoticeCaliforniaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
