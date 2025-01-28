import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaoBorrowingApprovalComponent } from './sao-borrowing-approval.component';

describe('SaoBorrowingApprovalComponent', () => {
  let component: SaoBorrowingApprovalComponent;
  let fixture: ComponentFixture<SaoBorrowingApprovalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SaoBorrowingApprovalComponent]
    });
    fixture = TestBed.createComponent(SaoBorrowingApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
