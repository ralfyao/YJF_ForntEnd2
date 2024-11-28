import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderShutRecordComponent } from './order-shut-record.component';

describe('OrderShutRecordComponent', () => {
  let component: OrderShutRecordComponent;
  let fixture: ComponentFixture<OrderShutRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderShutRecordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderShutRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
