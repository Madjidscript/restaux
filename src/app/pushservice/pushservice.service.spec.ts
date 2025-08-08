import { TestBed } from '@angular/core/testing';

import { PushserviceService } from './pushservice.service';

describe('PushserviceService', () => {
  let service: PushserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PushserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
