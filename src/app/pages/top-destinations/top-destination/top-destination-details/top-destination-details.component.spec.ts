import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopDestinationDetailsComponent } from './top-destination-details.component';

describe('TopDestinationDetailsComponent', () => {
  let component: TopDestinationDetailsComponent;
  let fixture: ComponentFixture<TopDestinationDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopDestinationDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopDestinationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
