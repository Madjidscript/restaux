import { TestBed } from '@angular/core/testing';

import { SoketserviceService } from './soketservice.service';

describe('SoketserviceService', () => {
  let service: SoketserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SoketserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
