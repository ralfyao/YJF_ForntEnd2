import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionLineReportComponent } from './production-line-report.component';

describe('ProductionLineReportComponent', () => {
  let component: ProductionLineReportComponent;
  let fixture: ComponentFixture<ProductionLineReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductionLineReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductionLineReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
