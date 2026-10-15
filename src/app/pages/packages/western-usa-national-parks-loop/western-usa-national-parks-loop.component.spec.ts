import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WesternUsaNationalParksLoopComponent } from './western-usa-national-parks-loop.component';

describe('WesternUsaNationalParksLoopComponent', () => {
  let component: WesternUsaNationalParksLoopComponent;
  let fixture: ComponentFixture<WesternUsaNationalParksLoopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WesternUsaNationalParksLoopComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WesternUsaNationalParksLoopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
