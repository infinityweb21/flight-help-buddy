import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HaritageRoomComponent } from './haritage-room.component';

describe('HaritageRoomComponent', () => {
  let component: HaritageRoomComponent;
  let fixture: ComponentFixture<HaritageRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HaritageRoomComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HaritageRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
