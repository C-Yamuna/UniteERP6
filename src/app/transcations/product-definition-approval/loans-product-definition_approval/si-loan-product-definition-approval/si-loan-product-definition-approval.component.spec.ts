import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiLoanProductDefinitionApprovalComponent } from './si-loan-product-definition-approval.component';

describe('SiLoanProductDefinitionApprovalComponent', () => {
  let component: SiLoanProductDefinitionApprovalComponent;
  let fixture: ComponentFixture<SiLoanProductDefinitionApprovalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SiLoanProductDefinitionApprovalComponent]
    });
    fixture = TestBed.createComponent(SiLoanProductDefinitionApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
