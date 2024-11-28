import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoldedNotPourComponent } from './molded-not-pour.component';

describe('MoldedNotPourComponent', () => {
  let component: MoldedNotPourComponent;
  let fixture: ComponentFixture<MoldedNotPourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoldedNotPourComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MoldedNotPourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
