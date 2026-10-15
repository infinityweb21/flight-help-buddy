import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecoendOfferComponent } from './recoend-offer.component';

describe('RecoendOfferComponent', () => {
  let component: RecoendOfferComponent;
  let fixture: ComponentFixture<RecoendOfferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecoendOfferComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecoendOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

