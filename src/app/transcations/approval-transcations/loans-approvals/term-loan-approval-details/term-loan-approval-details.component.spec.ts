import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermLoanApprovalDetailsComponent } from './term-loan-approval-details.component';

describe('TermLoanApprovalDetailsComponent', () => {
  let component: TermLoanApprovalDetailsComponent;
  let fixture: ComponentFixture<TermLoanApprovalDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TermLoanApprovalDetailsComponent]
    });
    fixture = TestBed.createComponent(TermLoanApprovalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
