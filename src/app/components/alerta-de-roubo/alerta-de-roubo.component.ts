import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-alerta-de-roubo',
  templateUrl: './alerta-de-roubo.component.html',
  styleUrls: ['./alerta-de-roubo.component.scss'],
})
export class AlertaDeRouboComponent implements OnInit {

  bikes:any[];
  constructor(private modalCtrl:ModalController, 
    private geolocation:Geolocation, private service:AuthService, private alertController: AlertController) { }

  async ngOnInit() {
    let dados = await this.service.getBikes();
    this.bikes = dados;

  }

  async salvarAlertaRoubo(){
    

    
    this.geolocation.getCurrentPosition({enableHighAccuracy:true}).then(async (resp)=>{
      
      var obj = {
        senha: $("#alertaRouboConfirmarSenha").val(),
        bikeid: $("#alertaRouboListaBikes").val(),
        mensagem: $("#alertaRouboComentarios").val(),
        lat: parseFloat(resp.coords.latitude.toString()), 
        lng: parseFloat(resp.coords.longitude.toString())
      };
      await this.enviarAlerta(obj);
      
    }).catch(async (error)=>{
      
      var obj = {
        senha: $("#alertaRouboConfirmarSenha").val(),
        bikeid: $("#alertaRouboListaBikes").val(),
        mensagem: $("#alertaRouboComentarios").val()
      };
      await this.enviarAlerta(obj);
      //console.log("sem GPS");
      //this.aviso("GPS","Sinal de GPS fora do ar.");
    });

  }

  async enviarAlerta(obj:any){
    console.log(obj);
    /*if(obj.senha==null || obj.senha==undefined || obj.senha==""){
      alert("Por favor, informe sua senha para gerar o alerta.");
      return;
    }*/
    if(obj.bikeid==null || obj.bikeid==undefined || obj.bikeid==""){
      alert("Por favor, escolha a bike que deseja informar o roubo.");
      return;
    }
    const confirm = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirmação',
      message: 'Deseja realmente registrar alerta de roubo?',
      buttons: [
        {
          text: 'Não',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            this.modalCtrl.dismiss({data:""});
          }
        }, {
          text: 'Sim',
          handler: async () => {
            
            let ret = await this.service.postAny("v1/avisoroubo", obj);

            this.modalCtrl.dismiss({data:"salvou"});
          }
        }
      ]
    });
    await confirm.present();
  }
  close(){
    this.modalCtrl.dismiss({data:"fechou"});
  }
}
