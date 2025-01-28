import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecurringDepositProductDefinitionApprovalDetailsComponent } from './recurring-deposit-product-definition-approval-details.component';

describe('RecurringDepositProductDefinitionApprovalDetailsComponent', () => {
  let component: RecurringDepositProductDefinitionApprovalDetailsComponent;
  let fixture: ComponentFixture<RecurringDepositProductDefinitionApprovalDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecurringDepositProductDefinitionApprovalDetailsComponent]
    });
    fixture = TestBed.createComponent(RecurringDepositProductDefinitionApprovalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
