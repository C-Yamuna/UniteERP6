import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiBorrowingApprovalComponent } from './si-borrowing-approval.component';

describe('SiBorrowingApprovalComponent', () => {
  let component: SiBorrowingApprovalComponent;
  let fixture: ComponentFixture<SiBorrowingApprovalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SiBorrowingApprovalComponent]
    });
    fixture = TestBed.createComponent(SiBorrowingApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
