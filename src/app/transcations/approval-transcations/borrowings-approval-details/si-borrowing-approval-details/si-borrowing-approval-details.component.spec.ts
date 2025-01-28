import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiBorrowingApprovalDetailsComponent } from './si-borrowing-approval-details.component';

describe('SiBorrowingApprovalDetailsComponent', () => {
  let component: SiBorrowingApprovalDetailsComponent;
  let fixture: ComponentFixture<SiBorrowingApprovalDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SiBorrowingApprovalDetailsComponent]
    });
    fixture = TestBed.createComponent(SiBorrowingApprovalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
