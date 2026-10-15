import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopDestinationsHeadComponent } from './top-destinations-head.component';

describe('TopDestinationsHeadComponent', () => {
  let component: TopDestinationsHeadComponent;
  let fixture: ComponentFixture<TopDestinationsHeadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopDestinationsHeadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopDestinationsHeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
