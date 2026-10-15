import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeacialDealsComponent } from './speacial-deals.component';

describe('SpeacialDealsComponent', () => {
  let component: SpeacialDealsComponent;
  let fixture: ComponentFixture<SpeacialDealsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpeacialDealsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpeacialDealsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
