import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchListComponent } from './dispatch-list.component';

describe('DispatchListComponent', () => {
  let component: DispatchListComponent;
  let fixture: ComponentFixture<DispatchListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DispatchListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DispatchListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
