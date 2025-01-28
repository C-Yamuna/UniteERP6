import { TestBed } from '@angular/core/testing';

import { CiLoanDocumentsDetailsService } from './ci-loan-documents-details.service';

describe('CiLoanDocumentsDetailsService', () => {
  let service: CiLoanDocumentsDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CiLoanDocumentsDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
