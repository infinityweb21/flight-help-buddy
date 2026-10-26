import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageConfirmationComponent } from './package-confirmation.component';

describe('PackageConfirmationComponent', () => {
  let component: PackageConfirmationComponent;
  let fixture: ComponentFixture<PackageConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PackageConfirmationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PackageConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
