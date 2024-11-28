import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipmentStateComponent } from './shipment-state.component';

describe('ShipmentStateComponent', () => {
  let component: ShipmentStateComponent;
  let fixture: ComponentFixture<ShipmentStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShipmentStateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipmentStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
