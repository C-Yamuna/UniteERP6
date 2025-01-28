import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BorrowingsApprovalDetailsComponent } from './borrowings-approval-details.component';

describe('BorrowingsApprovalDetailsComponent', () => {
  let component: BorrowingsApprovalDetailsComponent;
  let fixture: ComponentFixture<BorrowingsApprovalDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BorrowingsApprovalDetailsComponent]
    });
    fixture = TestBed.createComponent(BorrowingsApprovalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
