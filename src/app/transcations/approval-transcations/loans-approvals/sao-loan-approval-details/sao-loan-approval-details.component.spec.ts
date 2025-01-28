import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaoLoanApprovalDetailsComponent } from './sao-loan-approval-details.component';

describe('SaoLoanApprovalDetailsComponent', () => {
  let component: SaoLoanApprovalDetailsComponent;
  let fixture: ComponentFixture<SaoLoanApprovalDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SaoLoanApprovalDetailsComponent]
    });
    fixture = TestBed.createComponent(SaoLoanApprovalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
