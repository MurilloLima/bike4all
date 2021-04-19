import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { RotaSemanalCriarPage } from './rota-semanal-criar.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { EscolharotaComponent } from 'src/app/components/escolharota/escolharota.component';

const routes: Routes = [
  {
    path: '',
    component: RotaSemanalCriarPage
  }
];

@NgModule({
  imports: [
    CommonModule, ComponentsModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [RotaSemanalCriarPage],
  entryComponents:[EscolharotaComponent]
})
export class RotaSemanalCriarPageModule {}
