import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PickingAbnormalComponent } from './picking-abnormal.component';

describe('PickingAbnormalComponent', () => {
  let component: PickingAbnormalComponent;
  let fixture: ComponentFixture<PickingAbnormalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PickingAbnormalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PickingAbnormalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
