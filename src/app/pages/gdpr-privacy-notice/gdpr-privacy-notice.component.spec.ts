import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GdprPrivacyNoticeComponent } from './gdpr-privacy-notice.component';

describe('GdprPrivacyNoticeComponent', () => {
  let component: GdprPrivacyNoticeComponent;
  let fixture: ComponentFixture<GdprPrivacyNoticeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GdprPrivacyNoticeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GdprPrivacyNoticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
