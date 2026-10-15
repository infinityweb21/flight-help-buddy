import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AirlinesRoutesComponent } from './airlines-routes.component';

describe('AirlinesRoutesComponent', () => {
  let component: AirlinesRoutesComponent;
  let fixture: ComponentFixture<AirlinesRoutesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AirlinesRoutesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AirlinesRoutesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
