import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplementReportWorkingComponent } from './supplement-report-working.component';

describe('SupplementReportWorkingComponent', () => {
  let component: SupplementReportWorkingComponent;
  let fixture: ComponentFixture<SupplementReportWorkingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupplementReportWorkingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplementReportWorkingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
