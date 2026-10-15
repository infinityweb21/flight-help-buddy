import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnUsaComponent } from './en-usa.component';

describe('EnUsaComponent', () => {
  let component: EnUsaComponent;
  let fixture: ComponentFixture<EnUsaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnUsaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnUsaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
