import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CruisesListComponent } from './cruises-list.component';

describe('CruiseListComponent', () => {
  let component: CruisesListComponent;
  let fixture: ComponentFixture<CruisesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CruisesListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CruisesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
