import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternationalRouteComponent } from './international-route.component';

describe('InternationalRouteComponent', () => {
  let component: InternationalRouteComponent;
  let fixture: ComponentFixture<InternationalRouteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InternationalRouteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InternationalRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
