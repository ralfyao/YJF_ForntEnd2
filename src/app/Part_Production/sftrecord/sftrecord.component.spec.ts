import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SFTRecordComponent } from './sftrecord.component';

describe('SFTRecordComponent', () => {
  let component: SFTRecordComponent;
  let fixture: ComponentFixture<SFTRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SFTRecordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SFTRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
