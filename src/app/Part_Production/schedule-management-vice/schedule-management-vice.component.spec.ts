import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleManagementViceComponent } from './schedule-management-vice.component';

describe('ScheduleManagementViceComponent', () => {
  let component: ScheduleManagementViceComponent;
  let fixture: ComponentFixture<ScheduleManagementViceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScheduleManagementViceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleManagementViceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
