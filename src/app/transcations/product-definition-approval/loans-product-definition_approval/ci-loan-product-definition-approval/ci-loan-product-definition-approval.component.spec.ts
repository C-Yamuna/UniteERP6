import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CiLoanProductDefinitionApprovalComponent } from './ci-loan-product-definition-approval.component';

describe('CiLoanProductDefinitionApprovalComponent', () => {
  let component: CiLoanProductDefinitionApprovalComponent;
  let fixture: ComponentFixture<CiLoanProductDefinitionApprovalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CiLoanProductDefinitionApprovalComponent]
    });
    fixture = TestBed.createComponent(CiLoanProductDefinitionApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
