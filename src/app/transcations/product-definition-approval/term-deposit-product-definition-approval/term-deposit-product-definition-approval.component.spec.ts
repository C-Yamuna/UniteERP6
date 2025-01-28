import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermDepositProductDefinitionApprovalComponent } from './term-deposit-product-definition-approval.component';

describe('TermDepositProductDefinitionApprovalComponent', () => {
  let component: TermDepositProductDefinitionApprovalComponent;
  let fixture: ComponentFixture<TermDepositProductDefinitionApprovalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TermDepositProductDefinitionApprovalComponent]
    });
    fixture = TestBed.createComponent(TermDepositProductDefinitionApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
