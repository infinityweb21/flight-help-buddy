import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageOfferComponent } from './package-offer.component';

describe('PackageOfferComponent', () => {
  let component: PackageOfferComponent;
  let fixture: ComponentFixture<PackageOfferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PackageOfferComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PackageOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
