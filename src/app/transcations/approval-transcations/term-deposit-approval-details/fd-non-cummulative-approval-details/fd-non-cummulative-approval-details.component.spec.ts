import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FdNonCummulativeApprovalDetailsComponent } from './fd-non-cummulative-approval-details.component';

describe('FdNonCummulativeApprovalDetailsComponent', () => {
  let component: FdNonCummulativeApprovalDetailsComponent;
  let fixture: ComponentFixture<FdNonCummulativeApprovalDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FdNonCummulativeApprovalDetailsComponent]
    });
    fixture = TestBed.createComponent(FdNonCummulativeApprovalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
