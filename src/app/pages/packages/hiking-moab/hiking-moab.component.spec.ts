import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HikingMoabComponent } from './hiking-moab.component';

describe('HikingMoabComponent', () => {
  let component: HikingMoabComponent;
  let fixture: ComponentFixture<HikingMoabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HikingMoabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HikingMoabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
