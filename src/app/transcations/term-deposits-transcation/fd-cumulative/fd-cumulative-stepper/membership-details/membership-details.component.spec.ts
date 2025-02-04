import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembershipDetailsComponent } from './membership-details.component';

describe('MembershipDetailsComponent', () => {
  let component: MembershipDetailsComponent;
  let fixture: ComponentFixture<MembershipDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MembershipDetailsComponent]
    });
    fixture = TestBed.createComponent(MembershipDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
