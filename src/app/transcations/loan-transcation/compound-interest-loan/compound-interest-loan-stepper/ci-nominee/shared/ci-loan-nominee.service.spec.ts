import { TestBed } from '@angular/core/testing';

import { CiLoanNomineeService } from './ci-loan-nominee.service';

describe('CiLoanNomineeService', () => {
  let service: CiLoanNomineeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CiLoanNomineeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
