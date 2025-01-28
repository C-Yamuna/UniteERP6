import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FdCummulativeProductDefinitionApprovalComponent } from './fd-cummulative-product-definition-approval.component';

describe('FdCummulativeProductDefinitionApprovalComponent', () => {
  let component: FdCummulativeProductDefinitionApprovalComponent;
  let fixture: ComponentFixture<FdCummulativeProductDefinitionApprovalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FdCummulativeProductDefinitionApprovalComponent]
    });
    fixture = TestBed.createComponent(FdCummulativeProductDefinitionApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
