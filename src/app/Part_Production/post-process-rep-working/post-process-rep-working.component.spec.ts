import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostProcessRepWorkingComponent } from './post-process-rep-working.component';

describe('PostProcessRepWorkingComponent', () => {
  let component: PostProcessRepWorkingComponent;
  let fixture: ComponentFixture<PostProcessRepWorkingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostProcessRepWorkingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostProcessRepWorkingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
