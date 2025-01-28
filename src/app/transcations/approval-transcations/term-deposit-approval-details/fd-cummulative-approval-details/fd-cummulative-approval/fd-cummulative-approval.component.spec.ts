import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FdCummulativeApprovalComponent } from './fd-cummulative-approval.component';

describe('FdCummulativeApprovalComponent', () => {
  let component: FdCummulativeApprovalComponent;
  let fixture: ComponentFixture<FdCummulativeApprovalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FdCummulativeApprovalComponent]
    });
    fixture = TestBed.createComponent(FdCummulativeApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
