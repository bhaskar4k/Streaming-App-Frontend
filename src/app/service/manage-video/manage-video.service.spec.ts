import { TestBed } from '@angular/core/testing';

import { ManageVideoService } from './manage-video.service';

describe('ManageVideoService', () => {
  let service: ManageVideoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageVideoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
