import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FdNonCummulativeProductDefinitionApprovalComponent } from './fd-non-cummulative-product-definition-approval.component';

describe('FdNonCummulativeProductDefinitionApprovalComponent', () => {
  let component: FdNonCummulativeProductDefinitionApprovalComponent;
  let fixture: ComponentFixture<FdNonCummulativeProductDefinitionApprovalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FdNonCummulativeProductDefinitionApprovalComponent]
    });
    fixture = TestBed.createComponent(FdNonCummulativeProductDefinitionApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
