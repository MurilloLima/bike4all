import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PasseiosPage } from './passeios.page';

describe('PasseiosPage', () => {
  let component: PasseiosPage;
  let fixture: ComponentFixture<PasseiosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PasseiosPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasseiosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
