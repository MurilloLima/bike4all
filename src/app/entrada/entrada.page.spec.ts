import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntradaPage } from './entrada.page';

describe('EntradaPage', () => {
  let component: EntradaPage;
  let fixture: ComponentFixture<EntradaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntradaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntradaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
