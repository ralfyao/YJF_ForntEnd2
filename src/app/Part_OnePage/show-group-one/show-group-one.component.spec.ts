import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowGroupOneComponent } from './show-group-one.component';

describe('ShowGroupOneComponent', () => {
  let component: ShowGroupOneComponent;
  let fixture: ComponentFixture<ShowGroupOneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowGroupOneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowGroupOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
