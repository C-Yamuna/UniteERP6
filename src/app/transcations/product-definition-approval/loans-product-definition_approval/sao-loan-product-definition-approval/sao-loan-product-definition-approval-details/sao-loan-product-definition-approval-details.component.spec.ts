import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaoLoanProductDefinitionApprovalDetailsComponent } from './sao-loan-product-definition-approval-details.component';

describe('SaoLoanProductDefinitionApprovalDetailsComponent', () => {
  let component: SaoLoanProductDefinitionApprovalDetailsComponent;
  let fixture: ComponentFixture<SaoLoanProductDefinitionApprovalDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SaoLoanProductDefinitionApprovalDetailsComponent]
    });
    fixture = TestBed.createComponent(SaoLoanProductDefinitionApprovalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
