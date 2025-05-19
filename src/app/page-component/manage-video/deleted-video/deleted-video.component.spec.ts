import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletedVideoComponent } from './deleted-video.component';

describe('DeletedVideoComponent', () => {
  let component: DeletedVideoComponent;
  let fixture: ComponentFixture<DeletedVideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeletedVideoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeletedVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
