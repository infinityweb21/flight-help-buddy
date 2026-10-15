import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopRoutesmainComponent } from './top-routesmain.component';

describe('TopRoutesmainComponent', () => {
  let component: TopRoutesmainComponent;
  let fixture: ComponentFixture<TopRoutesmainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopRoutesmainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopRoutesmainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
