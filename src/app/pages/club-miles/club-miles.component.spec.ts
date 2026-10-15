import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClubMilesComponent } from './club-miles.component';

describe('ClubMilesComponent', () => {
  let component: ClubMilesComponent;
  let fixture: ComponentFixture<ClubMilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClubMilesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClubMilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
