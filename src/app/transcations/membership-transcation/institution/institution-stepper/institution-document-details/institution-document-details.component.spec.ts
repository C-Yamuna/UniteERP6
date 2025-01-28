import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstitutionDocumentDetailsComponent } from './institution-document-details.component';

describe('InstitutionDocumentDetailsComponent', () => {
  let component: InstitutionDocumentDetailsComponent;
  let fixture: ComponentFixture<InstitutionDocumentDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InstitutionDocumentDetailsComponent]
    });
    fixture = TestBed.createComponent(InstitutionDocumentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
