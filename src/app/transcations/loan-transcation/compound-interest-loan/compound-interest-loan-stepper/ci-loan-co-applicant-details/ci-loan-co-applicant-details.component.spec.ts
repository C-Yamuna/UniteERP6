import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CiLoanCoApplicantDetailsComponent } from './ci-loan-co-applicant-details.component';

describe('CiLoanCoApplicantDetailsComponent', () => {
  let component: CiLoanCoApplicantDetailsComponent;
  let fixture: ComponentFixture<CiLoanCoApplicantDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CiLoanCoApplicantDetailsComponent]
    });
    fixture = TestBed.createComponent(CiLoanCoApplicantDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
