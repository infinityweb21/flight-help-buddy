import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AirportDrawerComponent } from './airport-drawer.component';

describe('AirportDrawerComponent', () => {
  let component: AirportDrawerComponent;
  let fixture: ComponentFixture<AirportDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AirportDrawerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AirportDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
