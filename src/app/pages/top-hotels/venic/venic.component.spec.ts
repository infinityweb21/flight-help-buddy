import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VenicComponent } from './venic.component';

describe('VenicComponent', () => {
  let component: VenicComponent;
  let fixture: ComponentFixture<VenicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VenicComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VenicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
