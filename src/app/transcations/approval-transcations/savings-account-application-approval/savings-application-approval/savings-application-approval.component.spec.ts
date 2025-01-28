import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavingsApplicationApprovalComponent } from './savings-application-approval.component';

describe('SavingsApplicationApprovalComponent', () => {
  let component: SavingsApplicationApprovalComponent;
  let fixture: ComponentFixture<SavingsApplicationApprovalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SavingsApplicationApprovalComponent]
    });
    fixture = TestBed.createComponent(SavingsApplicationApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
