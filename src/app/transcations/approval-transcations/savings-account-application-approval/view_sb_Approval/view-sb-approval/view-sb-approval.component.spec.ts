import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSbApprovalComponent } from './view-sb-approval.component';

describe('ViewSbApprovalComponent', () => {
  let component: ViewSbApprovalComponent;
  let fixture: ComponentFixture<ViewSbApprovalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewSbApprovalComponent]
    });
    fixture = TestBed.createComponent(ViewSbApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
