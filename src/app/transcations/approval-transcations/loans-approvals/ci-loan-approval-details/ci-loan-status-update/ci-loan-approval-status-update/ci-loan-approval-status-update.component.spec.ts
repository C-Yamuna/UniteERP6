import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CiLoanApprovalStatusUpdateComponent } from './ci-loan-approval-status-update.component';

describe('CiLoanApprovalStatusUpdateComponent', () => {
  let component: CiLoanApprovalStatusUpdateComponent;
  let fixture: ComponentFixture<CiLoanApprovalStatusUpdateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CiLoanApprovalStatusUpdateComponent]
    });
    fixture = TestBed.createComponent(CiLoanApprovalStatusUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
