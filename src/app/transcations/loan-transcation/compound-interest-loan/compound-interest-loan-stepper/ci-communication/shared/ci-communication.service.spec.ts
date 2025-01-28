import { TestBed } from '@angular/core/testing';

import { CiCommunicationService } from './ci-communication.service';

describe('CiCommunicationService', () => {
  let service: CiCommunicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CiCommunicationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
