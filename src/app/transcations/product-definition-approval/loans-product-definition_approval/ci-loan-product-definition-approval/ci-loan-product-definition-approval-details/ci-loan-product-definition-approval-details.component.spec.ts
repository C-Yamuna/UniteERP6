import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CiLoanProductDefinitionApprovalDetailsComponent } from './ci-loan-product-definition-approval-details.component';

describe('CiLoanProductDefinitionApprovalDetailsComponent', () => {
  let component: CiLoanProductDefinitionApprovalDetailsComponent;
  let fixture: ComponentFixture<CiLoanProductDefinitionApprovalDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CiLoanProductDefinitionApprovalDetailsComponent]
    });
    fixture = TestBed.createComponent(CiLoanProductDefinitionApprovalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
