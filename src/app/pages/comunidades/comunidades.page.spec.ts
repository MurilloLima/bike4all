import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComunidadesPage } from './comunidades.page';

describe('ComunidadesPage', () => {
  let component: ComunidadesPage;
  let fixture: ComponentFixture<ComunidadesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComunidadesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComunidadesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
