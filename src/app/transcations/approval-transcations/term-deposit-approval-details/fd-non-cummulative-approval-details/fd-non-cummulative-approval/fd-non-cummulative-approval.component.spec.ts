import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FdNonCummulativeApprovalComponent } from './fd-non-cummulative-approval.component';

describe('FdNonCummulativeApprovalComponent', () => {
  let component: FdNonCummulativeApprovalComponent;
  let fixture: ComponentFixture<FdNonCummulativeApprovalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FdNonCummulativeApprovalComponent]
    });
    fixture = TestBed.createComponent(FdNonCummulativeApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
