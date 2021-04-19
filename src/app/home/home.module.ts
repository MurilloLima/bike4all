import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { CentralajudaComponent } from '../components/centralajuda/centralajuda.component';
import { TermosDeUsoComponent } from '../components/termos-de-uso/termos-de-uso.component';
import { AlertaDeRouboComponent } from '../components/alerta-de-roubo/alerta-de-roubo.component';
import { AlertasComponent } from '../components/alertas/alertas.component';

@NgModule({
  imports: [
    CommonModule,ComponentsModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      
      { 
        path: 'home', 
        component:HomePage, 
        children:[
          /**/
          { path: 'mapa', loadChildren: '../pages/mapa/mapa.module#MapaPageModule' },
          /* */
          /*
          { path: 'mapabox', loadChildren: '../pages/mapa/mapa.module#MapaPageModule' },
          { path: 'mapa', loadChildren: '../pages/mapabox/mapabox.module#MapaboxPageModule' },*/
          { path: 'meuperfil', loadChildren: '../pages/meuperfil/meuperfil.module#MeuperfilPageModule' },
          { path: 'meu-perfil', loadChildren: '../pages/meuperfil/meuperfil.module#MeuperfilPageModule' },
          { path: 'bikes', loadChildren: '../pages/bikes/bikes.module#BikesPageModule' },
          { path: 'configuracoes', loadChildren: '../pages/configuracoes/configuracoes.module#ConfiguracoesPageModule' },
          { path: 'atividades', loadChildren: '../pages/atividades/atividades.module#AtividadesPageModule' },

          { path: 'passeios', loadChildren: '../pages/passeios/passeios.module#PasseiosPageModule' },
          { path: 'passeios-detalhe', loadChildren: '../pages/passeios-detalhe/passeios-detalhe.module#PasseiosDetalhePageModule' },
          { path: 'passeios-criar', loadChildren: '../pages/passeios-criar/passeios-criar.module#PasseiosCriarPageModule' },
          
          { path: 'comunidades', loadChildren: '../pages/comunidades/comunidades.module#ComunidadesPageModule' },
          { path: 'comunidades-criar', loadChildren: '../pages/comunidades-criar/comunidades-criar.module#ComunidadesCriarPageModule' },
          { path: 'comunidades-detalhe', loadChildren: '../pages/comunidades-detalhe/comunidades-detalhe.module#ComunidadesDetalhePageModule' },
          { path: 'performance', loadChildren: '../pages/performance/performance.module#PerformancePageModule' },
        ] 
      },
      { 
        path: '', 
        redirectTo: 'home/mapa' 
      }
    ])
  ],
  declarations: [HomePage,CentralajudaComponent,TermosDeUsoComponent],
  entryComponents:[CentralajudaComponent,TermosDeUsoComponent,AlertaDeRouboComponent,AlertasComponent]
})
export class HomePageModule {}
