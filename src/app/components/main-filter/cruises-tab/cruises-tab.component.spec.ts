import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CruisesTabComponent } from './cruises-tab.component';

describe('CruisesTabComponent', () => {
  let component: CruisesTabComponent;
  let fixture: ComponentFixture<CruisesTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CruisesTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CruisesTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
