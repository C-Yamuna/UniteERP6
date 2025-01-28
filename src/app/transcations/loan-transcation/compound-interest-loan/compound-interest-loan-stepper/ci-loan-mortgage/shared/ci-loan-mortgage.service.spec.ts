import { TestBed } from '@angular/core/testing';

import { CiLoanMortgageService } from './ci-loan-mortgage.service';

describe('CiLoanMortgageService', () => {
  let service: CiLoanMortgageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CiLoanMortgageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
