import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PasseiosCriarPage } from './passeios-criar.page';
import { EscolharotaComponent } from '../../components/escolharota/escolharota.component';
import { ComponentsModule } from 'src/app/components/components.module';

const routes: Routes = [
  {
    path: '',
    component: PasseiosCriarPage
  }
];

@NgModule({
  imports: [
    CommonModule, ComponentsModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PasseiosCriarPage],
  entryComponents:[EscolharotaComponent]
})
export class PasseiosCriarPageModule {}
