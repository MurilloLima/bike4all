import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { ComponentsModule } from 'src/app/components/components.module';
import { IonicModule } from '@ionic/angular';

import { MapaPage } from './mapa.page';
import { AlertaDeRouboComponent } from 'src/app/components/alerta-de-roubo/alerta-de-roubo.component';

const routes: Routes = [
  {
    path: '',
    component: MapaPage
  }
];

@NgModule({
  imports: [
    CommonModule, ComponentsModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MapaPage],
  entryComponents:[AlertaDeRouboComponent]
})
export class MapaPageModule {}
