import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavingsBankProductDefinitionApprovalDetailsComponent } from './savings-bank-product-definition-approval-details.component';

describe('SavingsBankProductDefinitionApprovalDetailsComponent', () => {
  let component: SavingsBankProductDefinitionApprovalDetailsComponent;
  let fixture: ComponentFixture<SavingsBankProductDefinitionApprovalDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SavingsBankProductDefinitionApprovalDetailsComponent]
    });
    fixture = TestBed.createComponent(SavingsBankProductDefinitionApprovalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
