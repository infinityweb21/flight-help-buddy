import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CycleUtahBryceZionNationalParksComponent } from './cycle-utah-bryce-zion-national-parks.component';

describe('CycleUtahBryceZionNationalParksComponent', () => {
  let component: CycleUtahBryceZionNationalParksComponent;
  let fixture: ComponentFixture<CycleUtahBryceZionNationalParksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CycleUtahBryceZionNationalParksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CycleUtahBryceZionNationalParksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
