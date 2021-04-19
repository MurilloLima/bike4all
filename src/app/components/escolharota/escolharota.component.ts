import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';

declare var google;

@Component({
  selector: 'app-escolharota',
  templateUrl: './escolharota.component.html',
  styleUrls: ['./escolharota.component.scss'],
})
export class EscolharotaComponent implements OnInit {
  gravacoes:any[];

  constructor(private modalCtrl:ModalController, private service: AuthService, private loadingController: LoadingController) { }

  ngOnInit() {
    this.gravacoes =[];
    this.loadDados();
  }

  async loadDados(){
    
    let loading = await this.loadingController.create({message:'Carregando...'});
    await loading.present();

    let retorno = await this.service.get("destinos");
    loading.dismiss();

    this.gravacoes = retorno.destinos;
  }

  async escolherrota(item:any){

    let loading = await this.loadingController.create({message:'Carregando...'});
    await loading.present();

    let retorno = await this.service.get("destinos/" + item.id + "?tipo=" + item.tipo);
    loading.dismiss();
    if(item.tipo=="2"){
      var destinos=[];
      for(var i=0;i<retorno.gravados.length;i++ ){
        var latlng = retorno.gravados[i].coords.split(',');
        var dest = new google.maps.LatLng(retorno.gravados[i].lat, retorno.gravados[i].lng);
        destinos.push({endereco: dest})
      }
      this.modalCtrl.dismiss({data:"escolheu", destinos: destinos});
    } else{

      var destinos=[];
      
      //partida
      var dest = new google.maps.LatLng(retorno.gravados[0].lat, retorno.gravados[0].lng);
      destinos.push({endereco: dest});

      //destino final
      //destinos.push({endereco: retorno.gravados[0].destino});
      

      this.modalCtrl.dismiss({data:"escolheu", destinos: destinos});
    }
  }

  close(){
    this.modalCtrl.dismiss({data:"fechou"});
  }
  
}
