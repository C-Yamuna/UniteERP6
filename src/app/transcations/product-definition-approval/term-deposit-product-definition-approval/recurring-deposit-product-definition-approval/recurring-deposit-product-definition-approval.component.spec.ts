import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecurringDepositProductDefinitionApprovalComponent } from './recurring-deposit-product-definition-approval.component';

describe('RecurringDepositProductDefinitionApprovalComponent', () => {
  let component: RecurringDepositProductDefinitionApprovalComponent;
  let fixture: ComponentFixture<RecurringDepositProductDefinitionApprovalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecurringDepositProductDefinitionApprovalComponent]
    });
    fixture = TestBed.createComponent(RecurringDepositProductDefinitionApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
