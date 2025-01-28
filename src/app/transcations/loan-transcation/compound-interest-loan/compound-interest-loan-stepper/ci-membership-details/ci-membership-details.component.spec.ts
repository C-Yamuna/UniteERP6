import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CiMembershipDetailsComponent } from './ci-membership-details.component';

describe('CiMembershipDetailsComponent', () => {
  let component: CiMembershipDetailsComponent;
  let fixture: ComponentFixture<CiMembershipDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CiMembershipDetailsComponent]
    });
    fixture = TestBed.createComponent(CiMembershipDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
