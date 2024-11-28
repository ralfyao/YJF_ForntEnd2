import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdProcTrackingComponent } from './prod-proc-tracking.component';

describe('ProdProcTrackingComponent', () => {
  let component: ProdProcTrackingComponent;
  let fixture: ComponentFixture<ProdProcTrackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProdProcTrackingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProdProcTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
