import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoldAccessRecordComponent } from './mold-access-record.component';

describe('MoldAccessRecordComponent', () => {
  let component: MoldAccessRecordComponent;
  let fixture: ComponentFixture<MoldAccessRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoldAccessRecordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MoldAccessRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
