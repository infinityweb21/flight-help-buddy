import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaldivesComponent } from './maldives.component';

describe('MaldivesComponent', () => {
  let component: MaldivesComponent;
  let fixture: ComponentFixture<MaldivesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaldivesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaldivesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
