import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternationalToUsComponent } from './international-to-us.component';

describe('InternationalToUsComponent', () => {
  let component: InternationalToUsComponent;
  let fixture: ComponentFixture<InternationalToUsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InternationalToUsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InternationalToUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
