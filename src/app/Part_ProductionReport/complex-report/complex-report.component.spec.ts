import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplexReportComponent } from './complex-report.component';

describe('ComplexReportComponent', () => {
  let component: ComplexReportComponent;
  let fixture: ComponentFixture<ComplexReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComplexReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplexReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
