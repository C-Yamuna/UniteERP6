import { TestBed } from '@angular/core/testing';

import { CiLoanCoApplicantDetailsService } from './ci-loan-co-applicant-details.service';

describe('CiLoanCoApplicantDetailsService', () => {
  let service: CiLoanCoApplicantDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CiLoanCoApplicantDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
