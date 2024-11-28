import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExceptionWorkHourComponent } from './exception-work-hour.component';

describe('ExceptionWorkHourComponent', () => {
  let component: ExceptionWorkHourComponent;
  let fixture: ComponentFixture<ExceptionWorkHourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExceptionWorkHourComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExceptionWorkHourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
