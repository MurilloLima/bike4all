import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PasseiosDetalhePage } from './passeios-detalhe.page';

const routes: Routes = [
  {
    path: '',
    component: PasseiosDetalhePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PasseiosDetalhePage]
})
export class PasseiosDetalhePageModule {}
