import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SantoriniComponent } from './santorini.component';

describe('SantoriniComponent', () => {
  let component: SantoriniComponent;
  let fixture: ComponentFixture<SantoriniComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SantoriniComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SantoriniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
