import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiLoanApprovalDetailsComponent } from './si-loan-approval-details.component';

describe('SiLoanApprovalDetailsComponent', () => {
  let component: SiLoanApprovalDetailsComponent;
  let fixture: ComponentFixture<SiLoanApprovalDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SiLoanApprovalDetailsComponent]
    });
    fixture = TestBed.createComponent(SiLoanApprovalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
