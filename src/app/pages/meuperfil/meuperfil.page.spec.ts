import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeuperfilPage } from './meuperfil.page';

describe('MeuperfilPage', () => {
  let component: MeuperfilPage;
  let fixture: ComponentFixture<MeuperfilPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeuperfilPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeuperfilPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
