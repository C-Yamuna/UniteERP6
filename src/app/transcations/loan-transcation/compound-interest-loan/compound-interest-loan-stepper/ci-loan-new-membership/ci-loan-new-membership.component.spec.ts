import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CiLoanNewMembershipComponent } from './ci-loan-new-membership.component';

describe('CiLoanNewMembershipComponent', () => {
  let component: CiLoanNewMembershipComponent;
  let fixture: ComponentFixture<CiLoanNewMembershipComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CiLoanNewMembershipComponent]
    });
    fixture = TestBed.createComponent(CiLoanNewMembershipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
