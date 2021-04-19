import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BikesPage } from './bikes.page';

describe('BikesPage', () => {
  let component: BikesPage;
  let fixture: ComponentFixture<BikesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BikesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BikesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
