import { TestBed } from '@angular/core/testing';

import { WebSocketLoginHandlerService } from './web-socket-login-handler.service';

describe('WebSocketLoginHandlerService', () => {
  let service: WebSocketLoginHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebSocketLoginHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
