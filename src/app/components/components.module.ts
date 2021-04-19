import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CustommapComponent } from './custommap/custommap.component';
import { EscolharotaComponent } from './escolharota/escolharota.component';
import { IonicModule } from '@ionic/angular';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { AlertaDeRouboComponent } from './alerta-de-roubo/alerta-de-roubo.component';
import { AlertasComponent } from './alertas/alertas.component';

@NgModule({
    declarations: [CustommapComponent, EscolharotaComponent, AlertaDeRouboComponent, AlertasComponent],
    imports:[IonicModule, CommonModule],
    exports:[CustommapComponent, EscolharotaComponent, AlertaDeRouboComponent, AlertasComponent],
    schemas:[CUSTOM_ELEMENTS_SCHEMA]

})
export class ComponentsModule{}