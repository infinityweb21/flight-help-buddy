import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageBookComponent } from './package-book.component';

describe('PackageBookComponent', () => {
  let component: PackageBookComponent;
  let fixture: ComponentFixture<PackageBookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PackageBookComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PackageBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
