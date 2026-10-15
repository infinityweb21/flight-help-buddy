import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TorontoComponent } from './toronto.component';

describe('TorontoComponent', () => {
  let component: TorontoComponent;
  let fixture: ComponentFixture<TorontoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TorontoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TorontoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
