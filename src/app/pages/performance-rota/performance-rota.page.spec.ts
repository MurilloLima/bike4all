import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformanceRotaPage } from './performance-rota.page';

describe('PerformanceRotaPage', () => {
  let component: PerformanceRotaPage;
  let fixture: ComponentFixture<PerformanceRotaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerformanceRotaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerformanceRotaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
