import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaoLoanProductDefinitionApprovalComponent } from './sao-loan-product-definition-approval.component';

describe('SaoLoanProductDefinitionApprovalComponent', () => {
  let component: SaoLoanProductDefinitionApprovalComponent;
  let fixture: ComponentFixture<SaoLoanProductDefinitionApprovalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SaoLoanProductDefinitionApprovalComponent]
    });
    fixture = TestBed.createComponent(SaoLoanProductDefinitionApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
