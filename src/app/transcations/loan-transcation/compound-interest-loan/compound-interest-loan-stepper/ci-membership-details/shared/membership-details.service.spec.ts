import { TestBed } from '@angular/core/testing';

import { MembershipDetailsService } from './membership-details.service';

describe('MembershipDetailsService', () => {
  let service: MembershipDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MembershipDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
