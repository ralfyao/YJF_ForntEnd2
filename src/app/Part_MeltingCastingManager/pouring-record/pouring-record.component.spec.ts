import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { PouringRecordComponent } from './pouring-record.component';

describe('PouringRecordComponent', () => {
  let component: PouringRecordComponent;
  let fixture: ComponentFixture<PouringRecordComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PouringRecordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PouringRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
