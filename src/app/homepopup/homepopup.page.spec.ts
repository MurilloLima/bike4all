import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HomepopupPage } from './homepopup.page';

describe('HomepopupPage', () => {
  let component: HomepopupPage;
  let fixture: ComponentFixture<HomepopupPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomepopupPage ],
      imports: [IonicModule.forRoot()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomepopupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
