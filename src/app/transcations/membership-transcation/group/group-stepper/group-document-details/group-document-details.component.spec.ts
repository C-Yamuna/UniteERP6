import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupDocumentDetailsComponent } from './group-document-details.component';

describe('GroupDocumentDetailsComponent', () => {
  let component: GroupDocumentDetailsComponent;
  let fixture: ComponentFixture<GroupDocumentDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GroupDocumentDetailsComponent]
    });
    fixture = TestBed.createComponent(GroupDocumentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
