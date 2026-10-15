import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CycleSonomaNapaValleyComponent } from './cycle-sonoma-napa-valley.component';

describe('CycleSonomaNapaValleyComponent', () => {
  let component: CycleSonomaNapaValleyComponent;
  let fixture: ComponentFixture<CycleSonomaNapaValleyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CycleSonomaNapaValleyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CycleSonomaNapaValleyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
