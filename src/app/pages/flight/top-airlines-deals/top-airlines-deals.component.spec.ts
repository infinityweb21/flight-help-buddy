import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopAirlinesDealsComponent } from './top-airlines-deals.component';

describe('TopAirlinesDealsComponent', () => {
  let component: TopAirlinesDealsComponent;
  let fixture: ComponentFixture<TopAirlinesDealsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopAirlinesDealsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopAirlinesDealsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
