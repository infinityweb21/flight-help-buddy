import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BugetFriendlyComponent } from './buget-friendly.component';

describe('BugetFriendlyComponent', () => {
  let component: BugetFriendlyComponent;
  let fixture: ComponentFixture<BugetFriendlyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BugetFriendlyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BugetFriendlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
