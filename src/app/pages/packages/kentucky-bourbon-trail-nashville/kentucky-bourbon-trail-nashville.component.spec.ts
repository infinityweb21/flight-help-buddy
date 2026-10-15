import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KentuckyBourbonTrailNashvilleComponent } from './kentucky-bourbon-trail-nashville.component';

describe('KentuckyBourbonTrailNashvilleComponent', () => {
  let component: KentuckyBourbonTrailNashvilleComponent;
  let fixture: ComponentFixture<KentuckyBourbonTrailNashvilleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KentuckyBourbonTrailNashvilleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KentuckyBourbonTrailNashvilleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
