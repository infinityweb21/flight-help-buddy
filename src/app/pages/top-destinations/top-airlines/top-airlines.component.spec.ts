import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopAirlinesComponent } from './top-airlines.component';

describe('TopAirlinesComponent', () => {
  let component: TopAirlinesComponent;
  let fixture: ComponentFixture<TopAirlinesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopAirlinesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopAirlinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
