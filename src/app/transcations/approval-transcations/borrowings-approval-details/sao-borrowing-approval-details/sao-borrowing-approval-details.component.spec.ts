import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaoBorrowingApprovalDetailsComponent } from './sao-borrowing-approval-details.component';

describe('SaoBorrowingApprovalDetailsComponent', () => {
  let component: SaoBorrowingApprovalDetailsComponent;
  let fixture: ComponentFixture<SaoBorrowingApprovalDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SaoBorrowingApprovalDetailsComponent]
    });
    fixture = TestBed.createComponent(SaoBorrowingApprovalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
