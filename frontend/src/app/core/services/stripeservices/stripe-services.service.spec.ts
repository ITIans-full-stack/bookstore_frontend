import { TestBed } from '@angular/core/testing';

import { StripeServicesService } from './stripe-services.service';

describe('StripeServicesService', () => {
  let service: StripeServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StripeServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
