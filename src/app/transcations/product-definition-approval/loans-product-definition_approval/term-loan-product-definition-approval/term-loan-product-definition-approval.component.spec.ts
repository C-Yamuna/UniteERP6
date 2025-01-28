import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermLoanProductDefinitionApprovalComponent } from './term-loan-product-definition-approval.component';

describe('TermLoanProductDefinitionApprovalComponent', () => {
  let component: TermLoanProductDefinitionApprovalComponent;
  let fixture: ComponentFixture<TermLoanProductDefinitionApprovalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TermLoanProductDefinitionApprovalComponent]
    });
    fixture = TestBed.createComponent(TermLoanProductDefinitionApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
