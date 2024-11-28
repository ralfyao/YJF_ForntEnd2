import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostProcQueryComponent } from './post-proc-query.component';

describe('PostProcQueryComponent', () => {
  let component: PostProcQueryComponent;
  let fixture: ComponentFixture<PostProcQueryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostProcQueryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostProcQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
