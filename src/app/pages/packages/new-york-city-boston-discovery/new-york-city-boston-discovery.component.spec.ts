import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewYorkCityBostonDiscoveryComponent } from './new-york-city-boston-discovery.component';

describe('NewYorkCityBostonDiscoveryComponent', () => {
  let component: NewYorkCityBostonDiscoveryComponent;
  let fixture: ComponentFixture<NewYorkCityBostonDiscoveryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewYorkCityBostonDiscoveryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewYorkCityBostonDiscoveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
