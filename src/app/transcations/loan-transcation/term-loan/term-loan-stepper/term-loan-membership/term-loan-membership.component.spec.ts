import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermLoanMembershipComponent } from './term-loan-membership.component';

describe('TermLoanMembershipComponent', () => {
  let component: TermLoanMembershipComponent;
  let fixture: ComponentFixture<TermLoanMembershipComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TermLoanMembershipComponent]
    });
    fixture = TestBed.createComponent(TermLoanMembershipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
