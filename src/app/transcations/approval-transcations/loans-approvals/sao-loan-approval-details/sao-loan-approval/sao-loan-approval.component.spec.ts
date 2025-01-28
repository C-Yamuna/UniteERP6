import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaoLoanApprovalComponent } from './sao-loan-approval.component';

describe('SaoLoanApprovalComponent', () => {
  let component: SaoLoanApprovalComponent;
  let fixture: ComponentFixture<SaoLoanApprovalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SaoLoanApprovalComponent]
    });
    fixture = TestBed.createComponent(SaoLoanApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
