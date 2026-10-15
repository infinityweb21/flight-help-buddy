import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineTravelAgencyComponent } from './online-travel-agency.component';

describe('OnlineTravelAgencyComponent', () => {
  let component: OnlineTravelAgencyComponent;
  let fixture: ComponentFixture<OnlineTravelAgencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnlineTravelAgencyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnlineTravelAgencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
