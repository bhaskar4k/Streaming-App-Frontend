import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadedVideoComponent } from './uploaded-video.component';

describe('UploadedVideoComponent', () => {
  let component: UploadedVideoComponent;
  let fixture: ComponentFixture<UploadedVideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadedVideoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadedVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
