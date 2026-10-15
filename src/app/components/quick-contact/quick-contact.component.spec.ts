import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickContactComponent } from './quick-contact.component';

describe('QuickContactComponent', () => {
  let component: QuickContactComponent;
  let fixture: ComponentFixture<QuickContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuickContactComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuickContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
