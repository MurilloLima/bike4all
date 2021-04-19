import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustommapComponent } from './custommap.component';

describe('CustommapComponent', () => {
  let component: CustommapComponent;
  let fixture: ComponentFixture<CustommapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustommapComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustommapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
