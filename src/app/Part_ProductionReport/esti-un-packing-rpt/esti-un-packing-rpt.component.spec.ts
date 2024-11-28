import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstiUnPackingRptComponent } from './esti-un-packing-rpt.component';

describe('EstiUnPackingRptComponent', () => {
  let component: EstiUnPackingRptComponent;
  let fixture: ComponentFixture<EstiUnPackingRptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstiUnPackingRptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EstiUnPackingRptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
