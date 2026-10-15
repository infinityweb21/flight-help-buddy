import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaliComponent } from './bali.component';

describe('BaliComponent', () => {
  let component: BaliComponent;
  let fixture: ComponentFixture<BaliComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaliComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaliComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
