import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermLoanNewMembershipComponent } from './term-loan-new-membership.component';

describe('TermLoanNewMembershipComponent', () => {
  let component: TermLoanNewMembershipComponent;
  let fixture: ComponentFixture<TermLoanNewMembershipComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TermLoanNewMembershipComponent]
    });
    fixture = TestBed.createComponent(TermLoanNewMembershipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
