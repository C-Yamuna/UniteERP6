import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharesWithdrawComponent } from './shares-withdraw.component';

describe('SharesWithdrawComponent', () => {
  let component: SharesWithdrawComponent;
  let fixture: ComponentFixture<SharesWithdrawComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SharesWithdrawComponent]
    });
    fixture = TestBed.createComponent(SharesWithdrawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
