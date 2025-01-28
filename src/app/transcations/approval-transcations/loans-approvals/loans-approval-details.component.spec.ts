import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoansApprovalDetailsComponent } from './loans-approval-details.component';

describe('LoansApprovalDetailsComponent', () => {
  let component: LoansApprovalDetailsComponent;
  let fixture: ComponentFixture<LoansApprovalDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoansApprovalDetailsComponent]
    });
    fixture = TestBed.createComponent(LoansApprovalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
