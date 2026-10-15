import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnCaComponent } from './en-ca.component';

describe('EnCaComponent', () => {
  let component: EnCaComponent;
  let fixture: ComponentFixture<EnCaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnCaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnCaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
