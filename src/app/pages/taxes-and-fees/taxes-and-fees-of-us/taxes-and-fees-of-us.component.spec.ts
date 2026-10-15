import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxesAndFeesOfUsComponent } from './taxes-and-fees-of-us.component';

describe('TaxesAndFeesOfUsComponent', () => {
  let component: TaxesAndFeesOfUsComponent;
  let fixture: ComponentFixture<TaxesAndFeesOfUsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaxesAndFeesOfUsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaxesAndFeesOfUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
