import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDefinitionApprovalComponent } from './product-definition-approval.component';

describe('ProductDefinitionApprovalComponent', () => {
  let component: ProductDefinitionApprovalComponent;
  let fixture: ComponentFixture<ProductDefinitionApprovalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductDefinitionApprovalComponent]
    });
    fixture = TestBed.createComponent(ProductDefinitionApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
