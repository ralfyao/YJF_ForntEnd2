import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowGroupEightComponent } from './show-group-eight.component';

describe('ShowGroupEightComponent', () => {
  let component: ShowGroupEightComponent;
  let fixture: ComponentFixture<ShowGroupEightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowGroupEightComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowGroupEightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
