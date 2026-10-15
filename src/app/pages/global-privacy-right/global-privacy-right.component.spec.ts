import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalPrivacyRightComponent } from './global-privacy-right.component';

describe('GlobalPrivacyRightComponent', () => {
  let component: GlobalPrivacyRightComponent;
  let fixture: ComponentFixture<GlobalPrivacyRightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GlobalPrivacyRightComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlobalPrivacyRightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
