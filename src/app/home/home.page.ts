import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouterEvent } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { MenuController, ModalController } from '@ionic/angular';
import { CentralajudaComponent } from '../components/centralajuda/centralajuda.component';
import { TermosDeUsoComponent } from '../components/termos-de-uso/termos-de-uso.component';
import { AlertaDeRouboComponent } from '../components/alerta-de-roubo/alerta-de-roubo.component';
import { AlertasComponent } from '../components/alertas/alertas.component';

import * as $ from "jquery";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  pages=[
    //{title:'Mapa MapBox', url:'/home/mapabox', icon:"pin", imagem:"menuMapa.png"},
    {title:'Meu perfil', url:'/home/meuperfil', icon:"pin", imagem:"menuMapa.png"},
    {title:'Cadastrar bike', url:'/popup/bikes', icon:"pin", imagem:"menuMapa.png"},
    //{title:'Alertar roubo', url:'/home/mapa', icon:"pin", imagem:"menuMapa.png"},
    //{title:'Central de ajuda', url:'/home/mapa', icon:"pin", imagem:"menuMapa.png"},
    //{title:'Termos de uso e privacidade', url:'/home/mapa', icon:"pin", imagem:"menuMapa.png"},
    //{title:'Configurações gerais', url:'/home/configuracoes', icon:"pin", imagem:"menuMapa.png"},
    //{title:'Consulta de bikes', url:'/home/bikes', icon:"pin", imagem:"menuMapa.png"}
  ];
  interval: any;
  selectedPath="";
  public fotoUrl="";
  public user:any = {};
  notificacoes: any[];
  
  constructor(private auth:AuthService
              , private modal: ModalController 
              , private router : Router
              , public menuCtrl: MenuController) {
                this.notificacoes =[];
    this.router.events.subscribe((event:RouterEvent)=> {
      this.selectedPath=event.url;

    });
    
  }

  async ngOnInit(){
    let retorno = await this.auth.get("meusdados");
    this.user = retorno.cadastro;
    this.fotoUrl = retorno.cadastro.urlimagem;
    await this.loadNotificacao();

    this.interval = setInterval(() => {
      
      this.loadNotificacao();
    
      //document.getElementById("gpsTempoHoras").innerHTML = tempo; 
    },10000);
  }
  async loadNotificacao(){

    var data = this.dataAtualFormatada();
    //alert(data);

    let retorno = await this.auth.get("notificacoes?data="+data);
    this.notificacoes = retorno.notificacoes;
    if(this.notificacoes.length>0) {
      $(".noti").show();
    }
    

  }
  dataAtualFormatada(){
    var data = new Date(),
        dia  = data.getDate().toString(),
        diaF = (dia.length == 1) ? '0'+dia : dia,
        mes  = (data.getMonth()+1).toString(), //+1 pois no getMonth Janeiro começa com zero.
        mesF = (mes.length == 1) ? '0'+mes : mes,
        anoF = data.getFullYear();

            
      var h = data.getHours().toString();
      var m = data.getMinutes().toString();
      var horaF = (h.length == 1) ? '0'+h : h,
      minutoF = (m.length == 1) ? '0'+m : m;
      
    return anoF+"-"+mesF+"-"+diaF+" "+horaF + ":"+ minutoF;
  }
  async isHorario(hora:any){
    var data = new Date(),
        dia  = data.getDate().toString(),
        diaF = (dia.length == 1) ? '0'+dia : dia,
        mes  = (data.getMonth()+1).toString(), //+1 pois no getMonth Janeiro começa com zero.
        mesF = (mes.length == 1) ? '0'+mes : mes,
        anoF = data.getFullYear();
      var h = data.getHours().toString();
      var m = data.getMinutes().toString();
      var horaF = (h.length == 1) ? '0'+h : h,
      minutoF = (m.length == 1) ? '0'+m : m;

    var horaAgora=horaF + ":"+ minutoF;
    if(horaAgora<hora)
      return false;
    else
      return true;
  }
  async openAjuda() {
    
    var obj = {};
    const myModal = await this.modal.create({
      component: CentralajudaComponent,
      componentProps: { dados: obj },
      cssClass: 'my-custom-modal-css'
    });
    
    myModal.onDidDismiss()
      .then((ret) => {
        if(ret.data.data=="fazalgo"){
          
        }
    });

    return await myModal.present();
  }

  async openTermo() {
    var obj = {};
    const myModal = await this.modal.create({
      component: TermosDeUsoComponent,
      componentProps: { dados: obj },
      cssClass: 'my-custom-modal-css'
    });
    
    myModal.onDidDismiss()
      .then((ret) => {
        if(ret.data.data=="fazalgo"){
          
        }
    });

    return await myModal.present();
  }

  async openAlertaRoubo() {
    var obj = {};
    const myModal = await this.modal.create({
      component: AlertaDeRouboComponent,
      componentProps: { dados: obj },
      cssClass: 'my-custom-modal-css'
    });
    
    myModal.onDidDismiss()
      .then((ret) => {
        if(ret.data.data=="fazalgo"){
          
        }
    });

    return await myModal.present();
  }
  
  async openAlertas() {
    var obj = {};
    const myModal = await this.modal.create({
      component: AlertasComponent,
      componentProps: { dados: obj },
      cssClass: 'my-custom-modal-css'
    });
    
    myModal.onDidDismiss()
      .then((ret) => {
        if(ret.data.data=="fazalgo"){
          
        }
    });

    return await myModal.present();
  }

  closeMenu() {
    this.menuCtrl.close();
  }

  async confirmar(tipo:any, id:any, participacao:any){
    var obj= {tipo: tipo, participacao: participacao};

    let retorno = await this.auth.post("notificacoes-confirmar/"+id, obj);
    await this.loadNotificacao();
  }

  async lerNotificacao(id:any){
    var obj= {origem: 'leitura', id: id};

    let retorno = await this.auth.post("notificacoes", obj);
    await this.loadNotificacao();
  }
  async iniciarTrajeto(tipo:any, id:any){

    this.router.navigateByUrl('/home/mapa?start=1&tipo=1&dest='+tipo+'&id=' + id);
    //let retorno = await this.auth.post("notificacoes-confirmar/"+id, obj);
    //await this.loadNotificacao();
  }
  async cancelarRota(tipo:any, id:any){
    let retorno = await this.auth.post("notificacoes-cancelar/"+id, {tipo:tipo});
    await this.loadNotificacao();
  }
  sair(){
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }

}
