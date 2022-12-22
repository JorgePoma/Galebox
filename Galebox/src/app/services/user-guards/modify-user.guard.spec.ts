import { TestBed } from '@angular/core/testing';

import { ModifyUserGuard } from './modify-user.guard';

describe('ModifyUserGuard', () => {
  let guard: ModifyUserGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ModifyUserGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
