import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AirMauritiusComponent } from './air-mauritius.component';

describe('AirMauritiusComponent', () => {
  let component: AirMauritiusComponent;
  let fixture: ComponentFixture<AirMauritiusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AirMauritiusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AirMauritiusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
