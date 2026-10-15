import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AirlinesDestinationComponent } from './airlines-destination.component';

describe('AirlinesDestinationComponent', () => {
  let component: AirlinesDestinationComponent;
  let fixture: ComponentFixture<AirlinesDestinationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AirlinesDestinationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AirlinesDestinationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
