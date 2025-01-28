import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FdCummulativeApprovalDetailsComponent } from './fd-cummulative-approval-details.component';

describe('FdCummulativeApprovalDetailsComponent', () => {
  let component: FdCummulativeApprovalDetailsComponent;
  let fixture: ComponentFixture<FdCummulativeApprovalDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FdCummulativeApprovalDetailsComponent]
    });
    fixture = TestBed.createComponent(FdCummulativeApprovalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
