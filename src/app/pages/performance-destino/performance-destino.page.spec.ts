import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformanceDestinoPage } from './performance-destino.page';

describe('PerformanceDestinoPage', () => {
  let component: PerformanceDestinoPage;
  let fixture: ComponentFixture<PerformanceDestinoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerformanceDestinoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerformanceDestinoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
