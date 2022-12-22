import { TestBed } from '@angular/core/testing';

import { ModifyPostGuard } from './modify-post.guard';

describe('ModifyPostGuard', () => {
  let guard: ModifyPostGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ModifyPostGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
