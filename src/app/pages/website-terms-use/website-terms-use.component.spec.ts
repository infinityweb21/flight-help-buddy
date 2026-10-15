import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebsiteTermsUseComponent } from './website-terms-use.component';

describe('WebsiteTermsUseComponent', () => {
  let component: WebsiteTermsUseComponent;
  let fixture: ComponentFixture<WebsiteTermsUseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebsiteTermsUseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebsiteTermsUseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
