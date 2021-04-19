import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RotaSemanalCriarPage } from './rota-semanal-criar.page';

describe('RotaSemanalCriarPage', () => {
  let component: RotaSemanalCriarPage;
  let fixture: ComponentFixture<RotaSemanalCriarPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RotaSemanalCriarPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RotaSemanalCriarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
