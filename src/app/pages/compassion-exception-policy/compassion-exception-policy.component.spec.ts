import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompassionExceptionPolicyComponent } from './compassion-exception-policy.component';

describe('CompassionExceptionPolicyComponent', () => {
  let component: CompassionExceptionPolicyComponent;
  let fixture: ComponentFixture<CompassionExceptionPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompassionExceptionPolicyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompassionExceptionPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
