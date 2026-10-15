import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HawaiianAirlinesComponent } from './hawaiian-airlines.component';

describe('HawaiianAirlinesComponent', () => {
  let component: HawaiianAirlinesComponent;
  let fixture: ComponentFixture<HawaiianAirlinesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HawaiianAirlinesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HawaiianAirlinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
