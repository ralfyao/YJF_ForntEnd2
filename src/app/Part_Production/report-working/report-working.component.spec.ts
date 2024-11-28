import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportWorkingComponent } from './report-working.component';

describe('ReportWorkingComponent', () => {
  let component: ReportWorkingComponent;
  let fixture: ComponentFixture<ReportWorkingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportWorkingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportWorkingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
