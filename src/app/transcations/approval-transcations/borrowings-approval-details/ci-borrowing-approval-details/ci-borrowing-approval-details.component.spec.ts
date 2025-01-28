import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CiBorrowingApprovalDetailsComponent } from './ci-borrowing-approval-details.component';

describe('CiBorrowingApprovalDetailsComponent', () => {
  let component: CiBorrowingApprovalDetailsComponent;
  let fixture: ComponentFixture<CiBorrowingApprovalDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CiBorrowingApprovalDetailsComponent]
    });
    fixture = TestBed.createComponent(CiBorrowingApprovalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
