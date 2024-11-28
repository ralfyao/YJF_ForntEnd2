import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoldingCoreReportComponent } from './molding-core-report.component';

describe('MoldingCoreReportComponent', () => {
  let component: MoldingCoreReportComponent;
  let fixture: ComponentFixture<MoldingCoreReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoldingCoreReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MoldingCoreReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
