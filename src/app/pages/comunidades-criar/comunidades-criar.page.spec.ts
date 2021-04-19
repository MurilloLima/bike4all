import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComunidadesCriarPage } from './comunidades-criar.page';

describe('ComunidadesCriarPage', () => {
  let component: ComunidadesCriarPage;
  let fixture: ComponentFixture<ComunidadesCriarPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComunidadesCriarPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComunidadesCriarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
