import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageHeroComponent } from './package-hero.component';

describe('PackageHeroComponent', () => {
  let component: PackageHeroComponent;
  let fixture: ComponentFixture<PackageHeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PackageHeroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PackageHeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
