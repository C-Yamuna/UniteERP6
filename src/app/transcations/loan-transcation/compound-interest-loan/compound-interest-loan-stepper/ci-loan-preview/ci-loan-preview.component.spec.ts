import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CiLoanPreviewComponent } from './ci-loan-preview.component';

describe('CiLoanPreviewComponent', () => {
  let component: CiLoanPreviewComponent;
  let fixture: ComponentFixture<CiLoanPreviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CiLoanPreviewComponent]
    });
    fixture = TestBed.createComponent(CiLoanPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
