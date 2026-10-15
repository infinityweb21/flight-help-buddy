import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopDestinationsListComponent } from './top-destinations-list.component';

describe('TopDestinationsListComponent', () => {
  let component: TopDestinationsListComponent;
  let fixture: ComponentFixture<TopDestinationsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopDestinationsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopDestinationsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
