import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequiredDocumentsComponent } from './required-documents.component';

describe('RequiredDocumentsComponent', () => {
  let component: RequiredDocumentsComponent;
  let fixture: ComponentFixture<RequiredDocumentsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RequiredDocumentsComponent]
    });
    fixture = TestBed.createComponent(RequiredDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
