import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelAgencyComponent } from './travel-agency.component';

describe('TravelAgencyComponent', () => {
  let component: TravelAgencyComponent;
  let fixture: ComponentFixture<TravelAgencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TravelAgencyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TravelAgencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
