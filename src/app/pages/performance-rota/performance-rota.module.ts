import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PerformanceRotaPage } from './performance-rota.page';

const routes: Routes = [
  {
    path: '',
    component: PerformanceRotaPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PerformanceRotaPage]
})
export class PerformanceRotaPageModule {}
