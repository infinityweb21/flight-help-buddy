import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstClassComponent } from './first-class.component';

describe('FirstClassComponent', () => {
  let component: FirstClassComponent;
  let fixture: ComponentFixture<FirstClassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FirstClassComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FirstClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
