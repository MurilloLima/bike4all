import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { RotaSemanalPage } from './rota-semanal.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { EscolharotaComponent } from 'src/app/components/escolharota/escolharota.component';

const routes: Routes = [
  {
    path: '',
    component: RotaSemanalPage
  }
];

@NgModule({
  imports: [
    CommonModule, ComponentsModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [RotaSemanalPage],
  entryComponents: [EscolharotaComponent]
})
export class RotaSemanalPageModule {}
