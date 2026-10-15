import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackagesTabComponent } from './packages-tab.component';

describe('PackagesTabComponent', () => {
  let component: PackagesTabComponent;
  let fixture: ComponentFixture<PackagesTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PackagesTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PackagesTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
