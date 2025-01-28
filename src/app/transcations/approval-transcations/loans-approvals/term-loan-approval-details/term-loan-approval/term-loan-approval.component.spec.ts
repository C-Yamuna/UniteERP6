import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermLoanApprovalComponent } from './term-loan-approval.component';

describe('TermLoanApprovalComponent', () => {
  let component: TermLoanApprovalComponent;
  let fixture: ComponentFixture<TermLoanApprovalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TermLoanApprovalComponent]
    });
    fixture = TestBed.createComponent(TermLoanApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
