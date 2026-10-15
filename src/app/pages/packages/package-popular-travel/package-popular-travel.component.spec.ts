import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackagePopularTravelComponent } from './package-popular-travel.component';

describe('PackagePopularTravelComponent', () => {
  let component: PackagePopularTravelComponent;
  let fixture: ComponentFixture<PackagePopularTravelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PackagePopularTravelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PackagePopularTravelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
