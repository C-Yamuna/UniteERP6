import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavingsBankProductDefinitionApprovalComponent } from './savings-bank-product-definition-approval.component';

describe('SavingsBankProductDefinitionApprovalComponent', () => {
  let component: SavingsBankProductDefinitionApprovalComponent;
  let fixture: ComponentFixture<SavingsBankProductDefinitionApprovalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SavingsBankProductDefinitionApprovalComponent]
    });
    fixture = TestBed.createComponent(SavingsBankProductDefinitionApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
