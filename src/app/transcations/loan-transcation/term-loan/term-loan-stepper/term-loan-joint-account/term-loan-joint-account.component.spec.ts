import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermLoanJointAccountComponent } from './term-loan-joint-account.component';

describe('TermLoanJointAccountComponent', () => {
  let component: TermLoanJointAccountComponent;
  let fixture: ComponentFixture<TermLoanJointAccountComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TermLoanJointAccountComponent]
    });
    fixture = TestBed.createComponent(TermLoanJointAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
