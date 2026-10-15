import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingaporeComponent } from './singapore.component';

describe('SingaporeComponent', () => {
  let component: SingaporeComponent;
  let fixture: ComponentFixture<SingaporeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingaporeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingaporeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
