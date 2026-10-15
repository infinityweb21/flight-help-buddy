import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallCtaComponent } from './call-cta.component';

describe('CallCtaComponent', () => {
  let component: CallCtaComponent;
  let fixture: ComponentFixture<CallCtaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CallCtaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CallCtaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
