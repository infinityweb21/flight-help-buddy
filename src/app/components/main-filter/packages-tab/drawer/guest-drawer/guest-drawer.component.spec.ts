import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestDrawerComponent } from './guest-drawer.component';

describe('GuestDrawerComponent', () => {
  let component: GuestDrawerComponent;
  let fixture: ComponentFixture<GuestDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuestDrawerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuestDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
