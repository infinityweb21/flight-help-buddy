import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelsTabComponent } from './hotels-tab.component';

describe('HotelsTabComponent', () => {
  let component: HotelsTabComponent;
  let fixture: ComponentFixture<HotelsTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HotelsTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HotelsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
