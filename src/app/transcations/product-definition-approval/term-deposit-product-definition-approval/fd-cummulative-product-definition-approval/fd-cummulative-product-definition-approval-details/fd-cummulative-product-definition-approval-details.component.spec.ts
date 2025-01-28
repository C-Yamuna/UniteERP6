import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FdCummulativeProductDefinitionApprovalDetailsComponent } from './fd-cummulative-product-definition-approval-details.component';

describe('FdCummulativeProductDefinitionApprovalDetailsComponent', () => {
  let component: FdCummulativeProductDefinitionApprovalDetailsComponent;
  let fixture: ComponentFixture<FdCummulativeProductDefinitionApprovalDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FdCummulativeProductDefinitionApprovalDetailsComponent]
    });
    fixture = TestBed.createComponent(FdCummulativeProductDefinitionApprovalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
