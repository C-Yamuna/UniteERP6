import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermLoanPreviewComponent } from './term-loan-preview.component';

describe('TermLoanPreviewComponent', () => {
  let component: TermLoanPreviewComponent;
  let fixture: ComponentFixture<TermLoanPreviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TermLoanPreviewComponent]
    });
    fixture = TestBed.createComponent(TermLoanPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
