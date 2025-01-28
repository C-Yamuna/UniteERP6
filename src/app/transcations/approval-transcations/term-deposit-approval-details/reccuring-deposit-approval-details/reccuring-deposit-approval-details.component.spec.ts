import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReccuringDepositApprovalDetailsComponent } from './reccuring-deposit-approval-details.component';

describe('ReccuringDepositApprovalDetailsComponent', () => {
  let component: ReccuringDepositApprovalDetailsComponent;
  let fixture: ComponentFixture<ReccuringDepositApprovalDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReccuringDepositApprovalDetailsComponent]
    });
    fixture = TestBed.createComponent(ReccuringDepositApprovalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
