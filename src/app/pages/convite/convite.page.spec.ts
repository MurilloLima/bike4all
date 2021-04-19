import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvitePage } from './convite.page';

describe('ConvitePage', () => {
  let component: ConvitePage;
  let fixture: ComponentFixture<ConvitePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConvitePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConvitePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
