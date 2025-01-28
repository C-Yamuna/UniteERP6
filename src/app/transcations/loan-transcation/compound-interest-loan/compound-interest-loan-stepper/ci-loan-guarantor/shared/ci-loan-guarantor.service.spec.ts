import { TestBed } from '@angular/core/testing';

import { CiLoanGuarantorService } from './ci-loan-guarantor.service';

describe('CiLoanGuarantorService', () => {
  let service: CiLoanGuarantorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CiLoanGuarantorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
