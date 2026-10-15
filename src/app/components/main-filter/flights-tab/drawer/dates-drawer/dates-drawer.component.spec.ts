import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatesDrawerComponent } from './dates-drawer.component';

describe('DatesDrawerComponent', () => {
  let component: DatesDrawerComponent;
  let fixture: ComponentFixture<DatesDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatesDrawerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatesDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
