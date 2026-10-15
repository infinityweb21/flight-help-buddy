import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParisFranceComponent } from './paris-france.component';

describe('ParisFranceComponent', () => {
  let component: ParisFranceComponent;
  let fixture: ComponentFixture<ParisFranceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParisFranceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParisFranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
