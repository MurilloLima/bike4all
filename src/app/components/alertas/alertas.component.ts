import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-alertas',
  templateUrl: './alertas.component.html',
  styleUrls: ['./alertas.component.scss'],
})
export class AlertasComponent implements OnInit {

  bikes:any[];
  constructor(private modalCtrl:ModalController, private service:AuthService, private alertController: AlertController) { }

  async ngOnInit() {
    let dados = await this.service.getMeusAlertas();
    this.bikes = dados;

  }
  close(){
    this.modalCtrl.dismiss({data:"fechou"});
  }

}
