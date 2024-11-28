import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutsourcedListComponent } from './outsourced-list.component';

describe('OutsourcedListComponent', () => {
  let component: OutsourcedListComponent;
  let fixture: ComponentFixture<OutsourcedListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutsourcedListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OutsourcedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
