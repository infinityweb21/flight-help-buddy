import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BagageInfoComponent } from './bagage-info.component';

describe('BagageInfoComponent', () => {
  let component: BagageInfoComponent;
  let fixture: ComponentFixture<BagageInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BagageInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BagageInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
