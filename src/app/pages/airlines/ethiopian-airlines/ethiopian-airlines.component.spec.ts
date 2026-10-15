import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EthiopianAirlinesComponent } from './ethiopian-airlines.component';

describe('EthiopianAirlinesComponent', () => {
  let component: EthiopianAirlinesComponent;
  let fixture: ComponentFixture<EthiopianAirlinesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EthiopianAirlinesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EthiopianAirlinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
