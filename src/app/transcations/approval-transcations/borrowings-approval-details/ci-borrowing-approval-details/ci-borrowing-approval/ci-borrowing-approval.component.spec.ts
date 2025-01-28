import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CiBorrowingApprovalComponent } from './ci-borrowing-approval.component';

describe('CiBorrowingApprovalComponent', () => {
  let component: CiBorrowingApprovalComponent;
  let fixture: ComponentFixture<CiBorrowingApprovalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CiBorrowingApprovalComponent]
    });
    fixture = TestBed.createComponent(CiBorrowingApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
