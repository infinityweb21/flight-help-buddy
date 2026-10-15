import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StanderdTwinRoomComponent } from './standerd-twin-room.component';

describe('StanderdTwinRoomComponent', () => {
  let component: StanderdTwinRoomComponent;
  let fixture: ComponentFixture<StanderdTwinRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StanderdTwinRoomComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StanderdTwinRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
