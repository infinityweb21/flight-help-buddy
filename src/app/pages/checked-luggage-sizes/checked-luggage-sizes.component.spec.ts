import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckedLuggageSizesComponent } from './checked-luggage-sizes.component';

describe('CheckedLuggageSizesComponent', () => {
  let component: CheckedLuggageSizesComponent;
  let fixture: ComponentFixture<CheckedLuggageSizesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckedLuggageSizesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckedLuggageSizesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
