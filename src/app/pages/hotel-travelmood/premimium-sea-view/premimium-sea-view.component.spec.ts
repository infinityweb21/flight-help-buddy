import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PremimiumSeaViewComponent } from './premimium-sea-view.component';

describe('PremimiumSeaViewComponent', () => {
  let component: PremimiumSeaViewComponent;
  let fixture: ComponentFixture<PremimiumSeaViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PremimiumSeaViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PremimiumSeaViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
