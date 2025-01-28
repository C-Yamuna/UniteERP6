import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReccuringDepositApprovalComponent } from './reccuring-deposit-approval.component';

describe('ReccuringDepositApprovalComponent', () => {
  let component: ReccuringDepositApprovalComponent;
  let fixture: ComponentFixture<ReccuringDepositApprovalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReccuringDepositApprovalComponent]
    });
    fixture = TestBed.createComponent(ReccuringDepositApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
