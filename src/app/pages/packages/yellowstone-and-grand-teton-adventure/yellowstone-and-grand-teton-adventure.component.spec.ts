import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YellowstoneAndGrandTetonAdventureComponent } from './yellowstone-and-grand-teton-adventure.component';

describe('YellowstoneAndGrandTetonAdventureComponent', () => {
  let component: YellowstoneAndGrandTetonAdventureComponent;
  let fixture: ComponentFixture<YellowstoneAndGrandTetonAdventureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YellowstoneAndGrandTetonAdventureComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YellowstoneAndGrandTetonAdventureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
