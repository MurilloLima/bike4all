import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EsquecisenhaPage } from './esquecisenha.page';

const routes: Routes = [
  {
    path: '',
    component: EsquecisenhaPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [EsquecisenhaPage]
})
export class EsquecisenhaPageModule {}
