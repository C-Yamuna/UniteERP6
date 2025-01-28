import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalTranscationsComponent } from './approval-transcations.component';

describe('ApprovalTranscationsComponent', () => {
  let component: ApprovalTranscationsComponent;
  let fixture: ComponentFixture<ApprovalTranscationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApprovalTranscationsComponent]
    });
    fixture = TestBed.createComponent(ApprovalTranscationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
