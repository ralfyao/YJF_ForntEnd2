import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostProcEstiProdRptComponent } from './post-proc-esti-prod-rpt.component';

describe('PostProcEstiProdRptComponent', () => {
  let component: PostProcEstiProdRptComponent;
  let fixture: ComponentFixture<PostProcEstiProdRptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostProcEstiProdRptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostProcEstiProdRptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
