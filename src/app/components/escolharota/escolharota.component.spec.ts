import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EscolharotaComponent } from './escolharota.component';

describe('EscolharotaComponent', () => {
  let component: EscolharotaComponent;
  let fixture: ComponentFixture<EscolharotaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EscolharotaComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EscolharotaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
