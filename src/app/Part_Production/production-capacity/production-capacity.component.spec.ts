import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionCapacityComponent } from './production-capacity.component';

describe('ProductionCapacityComponent', () => {
  let component: ProductionCapacityComponent;
  let fixture: ComponentFixture<ProductionCapacityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductionCapacityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductionCapacityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
