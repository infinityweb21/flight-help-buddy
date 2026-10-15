import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CycleMaineAcadiaNationalParkComponent } from './cycle-maine-acadia-national-park.component';

describe('CycleMaineAcadiaNationalParkComponent', () => {
  let component: CycleMaineAcadiaNationalParkComponent;
  let fixture: ComponentFixture<CycleMaineAcadiaNationalParkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CycleMaineAcadiaNationalParkComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CycleMaineAcadiaNationalParkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
