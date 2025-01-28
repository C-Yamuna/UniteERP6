import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavingsAccountTransactionAppovalComponent } from './savings-account-transaction-appoval.component';

describe('SavingsAccountTransactionAppovalComponent', () => {
  let component: SavingsAccountTransactionAppovalComponent;
  let fixture: ComponentFixture<SavingsAccountTransactionAppovalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SavingsAccountTransactionAppovalComponent]
    });
    fixture = TestBed.createComponent(SavingsAccountTransactionAppovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
