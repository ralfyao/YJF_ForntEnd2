import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderShutComponent } from './order-shut.component';

describe('OrderShutComponent', () => {
  let component: OrderShutComponent;
  let fixture: ComponentFixture<OrderShutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderShutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderShutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
