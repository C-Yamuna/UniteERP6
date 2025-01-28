import { TestBed } from '@angular/core/testing';

import { CiLoanGuardianService } from './ci-loan-guardian.service';

describe('CiLoanGuardianService', () => {
  let service: CiLoanGuardianService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CiLoanGuardianService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
