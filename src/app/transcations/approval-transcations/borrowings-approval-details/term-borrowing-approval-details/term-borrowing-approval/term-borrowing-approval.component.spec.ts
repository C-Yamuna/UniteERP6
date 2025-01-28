import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermBorrowingApprovalComponent } from './term-borrowing-approval.component';

describe('TermBorrowingApprovalComponent', () => {
  let component: TermBorrowingApprovalComponent;
  let fixture: ComponentFixture<TermBorrowingApprovalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TermBorrowingApprovalComponent]
    });
    fixture = TestBed.createComponent(TermBorrowingApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
