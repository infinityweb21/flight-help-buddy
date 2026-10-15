import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MountainViewComponent } from './mountain-view.component';

describe('MountainViewComponent', () => {
  let component: MountainViewComponent;
  let fixture: ComponentFixture<MountainViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MountainViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MountainViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
