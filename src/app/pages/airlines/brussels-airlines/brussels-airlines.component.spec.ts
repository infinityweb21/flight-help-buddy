import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrusselsAirlinesComponent } from './brussels-airlines.component';

describe('BrusselsAirlinesComponent', () => {
  let component: BrusselsAirlinesComponent;
  let fixture: ComponentFixture<BrusselsAirlinesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrusselsAirlinesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrusselsAirlinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
