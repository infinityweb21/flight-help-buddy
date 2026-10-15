import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawerWrapperComponent } from './drawer-wrapper.component';

describe('DrawerWrapperComponent', () => {
  let component: DrawerWrapperComponent;
  let fixture: ComponentFixture<DrawerWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrawerWrapperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrawerWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
