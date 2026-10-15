import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OurServiceFeesComponent } from './our-service-fees.component';

describe('OurServiceFeesComponent', () => {
  let component: OurServiceFeesComponent;
  let fixture: ComponentFixture<OurServiceFeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OurServiceFeesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OurServiceFeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
