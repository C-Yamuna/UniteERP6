import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiLoanApprovalComponent } from './si-loan-approval.component';

describe('SiLoanApprovalComponent', () => {
  let component: SiLoanApprovalComponent;
  let fixture: ComponentFixture<SiLoanApprovalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SiLoanApprovalComponent]
    });
    fixture = TestBed.createComponent(SiLoanApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
