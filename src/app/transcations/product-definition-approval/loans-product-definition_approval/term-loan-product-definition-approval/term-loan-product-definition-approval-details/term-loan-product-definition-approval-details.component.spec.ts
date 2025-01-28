import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermLoanProductDefinitionApprovalDetailsComponent } from './term-loan-product-definition-approval-details.component';

describe('TermLoanProductDefinitionApprovalDetailsComponent', () => {
  let component: TermLoanProductDefinitionApprovalDetailsComponent;
  let fixture: ComponentFixture<TermLoanProductDefinitionApprovalDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TermLoanProductDefinitionApprovalDetailsComponent]
    });
    fixture = TestBed.createComponent(TermLoanProductDefinitionApprovalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
