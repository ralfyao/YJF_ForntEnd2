import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoldStockChangeComponent } from './mold-stock-change.component';

describe('MoldStockChangeComponent', () => {
  let component: MoldStockChangeComponent;
  let fixture: ComponentFixture<MoldStockChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoldStockChangeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MoldStockChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
