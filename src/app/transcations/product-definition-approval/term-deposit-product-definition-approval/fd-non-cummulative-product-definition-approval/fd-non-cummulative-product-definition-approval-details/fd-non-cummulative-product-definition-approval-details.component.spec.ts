import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FdNonCummulativeProductDefinitionApprovalDetailsComponent } from './fd-non-cummulative-product-definition-approval-details.component';

describe('FdNonCummulativeProductDefinitionApprovalDetailsComponent', () => {
  let component: FdNonCummulativeProductDefinitionApprovalDetailsComponent;
  let fixture: ComponentFixture<FdNonCummulativeProductDefinitionApprovalDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FdNonCummulativeProductDefinitionApprovalDetailsComponent]
    });
    fixture = TestBed.createComponent(FdNonCummulativeProductDefinitionApprovalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
