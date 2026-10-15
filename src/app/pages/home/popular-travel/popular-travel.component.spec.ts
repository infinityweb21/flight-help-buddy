import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopularTravelComponent } from './popular-travel.component';

describe('PopularTravelComponent', () => {
  let component: PopularTravelComponent;
  let fixture: ComponentFixture<PopularTravelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopularTravelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopularTravelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
