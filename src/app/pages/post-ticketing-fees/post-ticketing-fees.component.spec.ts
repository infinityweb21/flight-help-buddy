import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostTicketingFeesComponent } from './post-ticketing-fees.component';

describe('PostTicketingFeesComponent', () => {
  let component: PostTicketingFeesComponent;
  let fixture: ComponentFixture<PostTicketingFeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostTicketingFeesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostTicketingFeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
