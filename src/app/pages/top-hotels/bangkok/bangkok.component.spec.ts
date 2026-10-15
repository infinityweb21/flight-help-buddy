import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BangkokComponent } from './bangkok.component';

describe('BangkokComponent', () => {
  let component: BangkokComponent;
  let fixture: ComponentFixture<BangkokComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BangkokComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BangkokComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
