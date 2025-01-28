import { TestBed } from '@angular/core/testing';

import { CiKycService } from './ci-kyc.service';

describe('CiKycService', () => {
  let service: CiKycService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CiKycService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
