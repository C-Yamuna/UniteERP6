import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermBorrowingApprovalDetailsComponent } from './term-borrowing-approval-details.component';

describe('TermBorrowingApprovalDetailsComponent', () => {
  let component: TermBorrowingApprovalDetailsComponent;
  let fixture: ComponentFixture<TermBorrowingApprovalDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TermBorrowingApprovalDetailsComponent]
    });
    fixture = TestBed.createComponent(TermBorrowingApprovalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
