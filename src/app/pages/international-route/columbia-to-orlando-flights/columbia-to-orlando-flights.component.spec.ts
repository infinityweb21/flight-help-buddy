import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumbiaToOrlandoFlightsComponent } from './columbia-to-orlando-flights.component';

describe('ColumbiaToOrlandoFlightsComponent', () => {
  let component: ColumbiaToOrlandoFlightsComponent;
  let fixture: ComponentFixture<ColumbiaToOrlandoFlightsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColumbiaToOrlandoFlightsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColumbiaToOrlandoFlightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
