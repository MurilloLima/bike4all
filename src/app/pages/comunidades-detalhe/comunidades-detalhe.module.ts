import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ComunidadesDetalhePage } from './comunidades-detalhe.page';

const routes: Routes = [
  {
    path: '',
    component: ComunidadesDetalhePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ComunidadesDetalhePage]
})
export class ComunidadesDetalhePageModule {}
