import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KualaLumperComponent } from './kuala-lumper.component';

describe('KualaLumperComponent', () => {
  let component: KualaLumperComponent;
  let fixture: ComponentFixture<KualaLumperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KualaLumperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KualaLumperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
