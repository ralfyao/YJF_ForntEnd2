import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelTrackingComponent } from './cancel-tracking.component';

describe('CancelTrackingComponent', () => {
  let component: CancelTrackingComponent;
  let fixture: ComponentFixture<CancelTrackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CancelTrackingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
