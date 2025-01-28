import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiLoanProductDefinitionApprovalDetailsComponent } from './si-loan-product-definition-approval-details.component';

describe('SiLoanProductDefinitionApprovalDetailsComponent', () => {
  let component: SiLoanProductDefinitionApprovalDetailsComponent;
  let fixture: ComponentFixture<SiLoanProductDefinitionApprovalDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SiLoanProductDefinitionApprovalDetailsComponent]
    });
    fixture = TestBed.createComponent(SiLoanProductDefinitionApprovalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
