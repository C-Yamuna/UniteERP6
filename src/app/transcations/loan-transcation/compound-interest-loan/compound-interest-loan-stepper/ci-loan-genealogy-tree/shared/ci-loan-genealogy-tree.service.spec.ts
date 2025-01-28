import { TestBed } from '@angular/core/testing';

import { CiLoanGenealogyTreeService } from './ci-loan-genealogy-tree.service';

describe('CiLoanGenealogyTreeService', () => {
  let service: CiLoanGenealogyTreeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CiLoanGenealogyTreeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
