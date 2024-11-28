import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeltingSalesRecordComponent } from './melting-sales-record.component';

describe('MeltingSalesRecordComponent', () => {
  let component: MeltingSalesRecordComponent;
  let fixture: ComponentFixture<MeltingSalesRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeltingSalesRecordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeltingSalesRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
