import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZionRanchStayComponent } from './zion-ranch-stay.component';

describe('ZionRanchStayComponent', () => {
  let component: ZionRanchStayComponent;
  let fixture: ComponentFixture<ZionRanchStayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZionRanchStayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZionRanchStayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
