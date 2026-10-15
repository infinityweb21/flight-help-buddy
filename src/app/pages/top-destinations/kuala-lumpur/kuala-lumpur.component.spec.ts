import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KualaLumpurComponent } from './kuala-lumpur.component';

describe('KualaLumpurComponent', () => {
  let component: KualaLumpurComponent;
  let fixture: ComponentFixture<KualaLumpurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KualaLumpurComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KualaLumpurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
