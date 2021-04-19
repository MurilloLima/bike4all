import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PasseiosCriarPage } from './passeios-criar.page';

describe('PasseiosCriarPage', () => {
  let component: PasseiosCriarPage;
  let fixture: ComponentFixture<PasseiosCriarPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PasseiosCriarPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasseiosCriarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
