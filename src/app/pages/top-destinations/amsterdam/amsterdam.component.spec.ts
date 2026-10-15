import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmsterdamComponent } from './amsterdam.component';

describe('AmsterdamComponent', () => {
  let component: AmsterdamComponent;
  let fixture: ComponentFixture<AmsterdamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AmsterdamComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AmsterdamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
