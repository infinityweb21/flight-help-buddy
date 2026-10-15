import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxesAndFeesOfCanadaComponent } from './taxes-and-fees-of-canada.component';

describe('TaxesAndFeesOfCanadaComponent', () => {
  let component: TaxesAndFeesOfCanadaComponent;
  let fixture: ComponentFixture<TaxesAndFeesOfCanadaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaxesAndFeesOfCanadaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaxesAndFeesOfCanadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
