import { TestBed } from '@angular/core/testing';

import { ChildrenauthGuard } from './childrenauth.guard';

describe('ChildrenauthGuard', () => {
  let guard: ChildrenauthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ChildrenauthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
