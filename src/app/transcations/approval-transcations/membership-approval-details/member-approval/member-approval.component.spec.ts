import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberApprovalComponent } from './member-approval.component';

describe('MemberApprovalComponent', () => {
  let component: MemberApprovalComponent;
  let fixture: ComponentFixture<MemberApprovalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MemberApprovalComponent]
    });
    fixture = TestBed.createComponent(MemberApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
