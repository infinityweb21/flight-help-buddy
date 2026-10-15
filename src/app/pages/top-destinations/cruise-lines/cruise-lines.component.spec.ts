import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CruiseLinesComponent } from './cruise-lines.component';

describe('CruiseLinesComponent', () => {
  let component: CruiseLinesComponent;
  let fixture: ComponentFixture<CruiseLinesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CruiseLinesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CruiseLinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
