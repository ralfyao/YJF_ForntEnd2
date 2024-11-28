import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlaskHistoryComponent } from './flask-history.component';

describe('FlaskHistoryComponent', () => {
  let component: FlaskHistoryComponent;
  let fixture: ComponentFixture<FlaskHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlaskHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlaskHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
