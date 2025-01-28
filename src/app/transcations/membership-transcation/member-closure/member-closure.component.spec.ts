import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberClosureComponent } from './member-closure.component';

describe('MemberClosureComponent', () => {
  let component: MemberClosureComponent;
  let fixture: ComponentFixture<MemberClosureComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MemberClosureComponent]
    });
    fixture = TestBed.createComponent(MemberClosureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
