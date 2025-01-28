import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavingsAccountApplicationApprovalComponent } from './savings-account-application-approval.component';

describe('SavingsAccountApplicationApprovalComponent', () => {
  let component: SavingsAccountApplicationApprovalComponent;
  let fixture: ComponentFixture<SavingsAccountApplicationApprovalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SavingsAccountApplicationApprovalComponent]
    });
    fixture = TestBed.createComponent(SavingsAccountApplicationApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
