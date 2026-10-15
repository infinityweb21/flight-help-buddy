import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OneWayDealsComponent } from './one-way-deals.component';

describe('OneWayDealsComponent', () => {
  let component: OneWayDealsComponent;
  let fixture: ComponentFixture<OneWayDealsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OneWayDealsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OneWayDealsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
