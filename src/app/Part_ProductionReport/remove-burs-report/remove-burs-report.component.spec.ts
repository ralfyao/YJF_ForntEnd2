import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveBursReportComponent } from './remove-burs-report.component';

describe('RemoveBursReportComponent', () => {
  let component: RemoveBursReportComponent;
  let fixture: ComponentFixture<RemoveBursReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RemoveBursReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveBursReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
