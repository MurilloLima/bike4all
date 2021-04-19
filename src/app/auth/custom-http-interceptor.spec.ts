import { TestBed } from '@angular/core/testing';

import { CustomHttpInterceptor } from './custom-http-interceptor';

describe('CustomHttpInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CustomHttpInterceptor = TestBed.get(CustomHttpInterceptor);
    expect(service).toBeTruthy();
  });
});
