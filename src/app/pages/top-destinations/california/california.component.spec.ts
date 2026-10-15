import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaliforniaComponent } from './california.component';

describe('CaliforniaComponent', () => {
  let component: CaliforniaComponent;
  let fixture: ComponentFixture<CaliforniaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaliforniaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaliforniaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
