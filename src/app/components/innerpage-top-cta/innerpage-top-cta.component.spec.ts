import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InnerpageTopCtaComponent } from './innerpage-top-cta.component';

describe('InnerpageTopCtaComponent', () => {
  let component: InnerpageTopCtaComponent;
  let fixture: ComponentFixture<InnerpageTopCtaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InnerpageTopCtaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InnerpageTopCtaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
