import { TestBed } from '@angular/core/testing';

import { CiLoanApplicationService } from './ci-loan-application.service';

describe('CiLoanApplicationService', () => {
  let service: CiLoanApplicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CiLoanApplicationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
