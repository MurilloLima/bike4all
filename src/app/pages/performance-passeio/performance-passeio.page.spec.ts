import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformancePasseioPage } from './performance-passeio.page';

describe('PerformancePasseioPage', () => {
  let component: PerformancePasseioPage;
  let fixture: ComponentFixture<PerformancePasseioPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerformancePasseioPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerformancePasseioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
