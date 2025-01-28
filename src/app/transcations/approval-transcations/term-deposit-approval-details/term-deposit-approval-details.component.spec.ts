import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermDepositApprovalDetailsComponent } from './term-deposit-approval-details.component';

describe('TermDepositApprovalDetailsComponent', () => {
  let component: TermDepositApprovalDetailsComponent;
  let fixture: ComponentFixture<TermDepositApprovalDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TermDepositApprovalDetailsComponent]
    });
    fixture = TestBed.createComponent(TermDepositApprovalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
