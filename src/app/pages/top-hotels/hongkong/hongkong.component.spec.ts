import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HongkongComponent } from './hongkong.component';

describe('HongkongComponent', () => {
  let component: HongkongComponent;
  let fixture: ComponentFixture<HongkongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HongkongComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HongkongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
