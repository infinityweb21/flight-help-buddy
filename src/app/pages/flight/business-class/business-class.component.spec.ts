import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessClassComponent } from './business-class.component';

describe('BusinessClassComponent', () => {
  let component: BusinessClassComponent;
  let fixture: ComponentFixture<BusinessClassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusinessClassComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
