import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PerformancePasseioPage } from './performance-passeio.page';

const routes: Routes = [
  {
    path: '',
    component: PerformancePasseioPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PerformancePasseioPage]
})
export class PerformancePasseioPageModule {}
