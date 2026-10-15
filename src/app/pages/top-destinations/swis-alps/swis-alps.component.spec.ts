import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwisAlpsComponent } from './swis-alps.component';

describe('SwisAlpsComponent', () => {
  let component: SwisAlpsComponent;
  let fixture: ComponentFixture<SwisAlpsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwisAlpsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SwisAlpsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
