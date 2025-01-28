import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CiLoanApprovalDetailsComponent } from './ci-loan-approval-details.component';

describe('CiLoanApprovalDetailsComponent', () => {
  let component: CiLoanApprovalDetailsComponent;
  let fixture: ComponentFixture<CiLoanApprovalDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CiLoanApprovalDetailsComponent]
    });
    fixture = TestBed.createComponent(CiLoanApprovalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
