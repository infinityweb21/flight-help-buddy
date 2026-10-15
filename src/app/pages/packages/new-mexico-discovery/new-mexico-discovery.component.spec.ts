import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewMexicoDiscoveryComponent } from './new-mexico-discovery.component';

describe('NewMexicoDiscoveryComponent', () => {
  let component: NewMexicoDiscoveryComponent;
  let fixture: ComponentFixture<NewMexicoDiscoveryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewMexicoDiscoveryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewMexicoDiscoveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
