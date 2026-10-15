import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceMatchPromiseComponent } from './price-match-promise.component';

describe('PriceMatchPromiseComponent', () => {
  let component: PriceMatchPromiseComponent;
  let fixture: ComponentFixture<PriceMatchPromiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PriceMatchPromiseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PriceMatchPromiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
