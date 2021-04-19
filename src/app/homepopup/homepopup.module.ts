import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { HomepopupPage } from './homepopup.page';

const routes: Routes = [
  
  { 
    path: '', 
    component:HomepopupPage, 
    children:[
      { path: 'bikes', loadChildren: '../pages/bikes/bikes.module#BikesPageModule' },
      { path: 'configuracoes', loadChildren: '../pages/configuracoes/configuracoes.module#ConfiguracoesPageModule' },
      { path: 'passeios-detalhe', loadChildren: '../pages/passeios-detalhe/passeios-detalhe.module#PasseiosDetalhePageModule' },
      { path: 'passeios-criar', loadChildren: '../pages/passeios-criar/passeios-criar.module#PasseiosCriarPageModule' },
      { path: 'comunidades-criar', loadChildren: '../pages/comunidades-criar/comunidades-criar.module#ComunidadesCriarPageModule' },
      { path: 'comunidades-detalhe', loadChildren: '../pages/comunidades-detalhe/comunidades-detalhe.module#ComunidadesDetalhePageModule' },
      { path: 'rota-semanal', loadChildren: '../pages/rota-semanal/rota-semanal.module#RotaSemanalPageModule' },
      { path: 'rota-semanal-criar', loadChildren: '../pages/rota-semanal-criar/rota-semanal-criar.module#RotaSemanalCriarPageModule' },
      { path: 'performance-passeio', loadChildren: '../pages/performance-passeio/performance-passeio.module#PerformancePasseioPageModule' },
      { path: 'performance-rota', loadChildren: '../pages/performance-rota/performance-rota.module#PerformanceRotaPageModule' },
      { path: 'performance-destino', loadChildren: '../pages/performance-destino/performance-destino.module#PerformanceDestinoPageModule' },
    ] 
  },
  { 
    path: '', 
    redirectTo: 'popup/meu-passeio' 
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [HomepopupPage]
})
export class HomepopupPageModule {}
