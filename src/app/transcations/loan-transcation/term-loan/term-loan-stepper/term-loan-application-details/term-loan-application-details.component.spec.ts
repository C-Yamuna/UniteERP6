import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermLoanApplicationDetailsComponent } from './term-loan-application-details.component';

describe('TermLoanApplicationDetailsComponent', () => {
  let component: TermLoanApplicationDetailsComponent;
  let fixture: ComponentFixture<TermLoanApplicationDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TermLoanApplicationDetailsComponent]
    });
    fixture = TestBed.createComponent(TermLoanApplicationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
