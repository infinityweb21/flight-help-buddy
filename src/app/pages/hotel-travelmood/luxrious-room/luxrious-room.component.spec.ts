import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LuxriousRoomComponent } from './luxrious-room.component';

describe('LuxriousRoomComponent', () => {
  let component: LuxriousRoomComponent;
  let fixture: ComponentFixture<LuxriousRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LuxriousRoomComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LuxriousRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
