import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from "./services/auth-guard.service";

const routes: Routes = [
  { path: '', loadChildren: './home/home.module#HomePageModule' , canActivate: [AuthGuardService]},
  { path: 'home', loadChildren: './home/home.module#HomePageModule' , canActivate: [AuthGuardService]},
  { path: 'popup', loadChildren: './homepopup/homepopup.module#HomepopupPageModule'  , canActivate: [AuthGuardService]},
  { path: 'esquecisenha', loadChildren: './auth/esquecisenha/esquecisenha.module#EsquecisenhaPageModule' },
  { path: 'recuperar', loadChildren: './auth/esquecisenha/esquecisenha.module#EsquecisenhaPageModule' },
  //{ path: 'principal', loadChildren: './principal/principal.module#PrincipalPageModule', canActivate: [AuthGuardService] },
  { path: 'register', loadChildren: './auth/register/register.module#RegisterPageModule' },
  { path: 'login', loadChildren: './auth/login/login.module#LoginPageModule' },
  { path: 'entrada', loadChildren: './entrada/entrada.module#EntradaPageModule' },

  { path: 'passeios-detalhe', loadChildren: './pages/passeios-detalhe/passeios-detalhe.module#PasseiosDetalhePageModule'  , canActivate: [AuthGuardService]},
  { path: 'passeios-criar', loadChildren: './pages/passeios-criar/passeios-criar.module#PasseiosCriarPageModule'  , canActivate: [AuthGuardService]},
  { path: 'comunidades-criar', loadChildren: './pages/comunidades-criar/comunidades-criar.module#ComunidadesCriarPageModule'  , canActivate: [AuthGuardService]},
  { path: 'comunidades-detalhe', loadChildren: './pages/comunidades-detalhe/comunidades-detalhe.module#ComunidadesDetalhePageModule'  , canActivate: [AuthGuardService]},

  { path: 'bikes', loadChildren: './pages/bikes/bikes.module#BikesPageModule'  , canActivate: [AuthGuardService]},
  { path: 'rota-semanal', loadChildren: './pages/rota-semanal/rota-semanal.module#RotaSemanalPageModule' },
  { path: 'rota-semanal-criar', loadChildren: './pages/rota-semanal-criar/rota-semanal-criar.module#RotaSemanalCriarPageModule' },
  { path: 'performance-passeio', loadChildren: './pages/performance-passeio/performance-passeio.module#PerformancePasseioPageModule' },
  { path: 'performance-rota', loadChildren: './pages/performance-rota/performance-rota.module#PerformanceRotaPageModule' },
  { path: 'performance-destino', loadChildren: './pages/performance-destino/performance-destino.module#PerformanceDestinoPageModule' },
  { path: 'convite', loadChildren: './pages/convite/convite.module#ConvitePageModule' },
  { path: 'convite/:slug', loadChildren: () => import('./pages/convite/convite.module').then( m => m.ConvitePageModule)},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
