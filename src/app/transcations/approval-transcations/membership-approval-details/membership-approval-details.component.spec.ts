import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembershipApprovalDetailsComponent } from './membership-approval-details.component';

describe('MembershipApprovalDetailsComponent', () => {
  let component: MembershipApprovalDetailsComponent;
  let fixture: ComponentFixture<MembershipApprovalDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MembershipApprovalDetailsComponent]
    });
    fixture = TestBed.createComponent(MembershipApprovalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
