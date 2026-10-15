import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalInformationPolicyComponent } from './personal-information-policy.component';

describe('PersonalInformationPolicyComponent', () => {
  let component: PersonalInformationPolicyComponent;
  let fixture: ComponentFixture<PersonalInformationPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonalInformationPolicyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonalInformationPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
