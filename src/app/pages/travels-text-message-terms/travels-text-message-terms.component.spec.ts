import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelsTextMessageTermsComponent } from './travels-text-message-terms.component';

describe('TravelsTextMessageTermsComponent', () => {
  let component: TravelsTextMessageTermsComponent;
  let fixture: ComponentFixture<TravelsTextMessageTermsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TravelsTextMessageTermsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TravelsTextMessageTermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
