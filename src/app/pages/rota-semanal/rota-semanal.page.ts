import { Component, OnInit } from '@angular/core';
import { MenuController, Platform, LoadingController, AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { SocialSharing} from '@ionic-native/social-sharing/ngx'
import { Clipboard } from '@ionic-native/clipboard/ngx';

import * as $ from "jquery";
declare let html2canvas;
declare var Chart;

@Component({
  selector: 'app-rota-semanal',
  templateUrl: './rota-semanal.page.html',
  styleUrls: ['./rota-semanal.page.scss'],
})
export class RotaSemanalPage implements OnInit {

  paginaAnterior:any="comunidades";
  public cadastro:any= { endereco:'', urlimagem:''};  
  public destinos:any[];
  constructor(private menu: MenuController
    , private router : Router
    , private service: AuthService
    , private plt: Platform
    , private loadingController: LoadingController
    , private alertController: AlertController
    , private socialSharing: SocialSharing
    , private clipboard: Clipboard
    , private toastCtrl: ToastController) { }

  async ngOnInit() {
    //await this.loadDados();
  }
  public ionViewWillEnter(): void {
    this.loadDados();
  }

  async loadDados(){
    
    let loading = await this.loadingController.create({message:'Carregando...'});
    await loading.present();

    let id = this.plt.getQueryParam("n");
    
    let ref = this.plt.getQueryParam("ref");
    if(ref!=null && ref!=""){
      this.paginaAnterior = ref;
    }

    let retorno = await this.service.get("rotas/" + id+"?data=" + this.dataAtualFormatada());
    loading.dismiss();

    this.cadastro = retorno.cadastro;
    if(this.cadastro.seg=='1' && this.cadastro.seghorario==''){
      $("#toggleDiaSemanaSegunda").attr("checked","true");
    }
    if(this.cadastro.ter=='1' && this.cadastro.terhorario==''){
      $("#toggleDiaSemanaSegunda").attr("checked","true");
    }
    if(this.cadastro.qua=='1' && this.cadastro.quahorario==''){
      $("#toggleDiaSemanaSegunda").attr("checked","true");
    }
    if(this.cadastro.qui=='1' && this.cadastro.quihorario==''){
      $("#toggleDiaSemanaSegunda").attr("checked","true");
    }
    if(this.cadastro.sex=='1' && this.cadastro.sexhorario==''){
      $("#toggleDiaSemanaSegunda").attr("checked","true");
    }
    if(this.cadastro.sab=='1' && this.cadastro.sabhorario==''){
      $("#toggleDiaSemanaSegunda").attr("checked","true");
    }
    if(this.cadastro.dom=='1' && this.cadastro.domhorario==''){
      $("#toggleDiaSemanaSegunda").attr("checked","true");
    }
    this.cadastro.segbool = (this.cadastro.seg=='1' && this.cadastro.seghorario=='');
    this.cadastro.terbool = this.cadastro.ter=='1' && this.cadastro.terhorario=='';
    this.cadastro.quabool = this.cadastro.qua=='1' && this.cadastro.quahorario=='';
    this.cadastro.quibool = this.cadastro.qui=='1' && this.cadastro.quihorario=='';
    this.cadastro.sexbool = this.cadastro.sex=='1' && this.cadastro.sexhorario=='';
    this.cadastro.sabbool = this.cadastro.sab=='1' && this.cadastro.sabhorario=='';
    this.cadastro.dombool = this.cadastro.dom=='1' && this.cadastro.domhorario=='';

    console.log(this.cadastro );
    this.destinos = retorno.destinos;
    
    if(this.destinos.length>0){
      this.cadastro.partida=this.destinos[0].endereco;
    }
    var elevacao=[];
    var labels=[];
    if(retorno.cadastro.elevacoes!=null )elevacao=retorno.cadastro.elevacoes.split(",");
    if(retorno.cadastro.labels!=null )labels=retorno.cadastro.labels.split(",");

    await this.loadGraficoElevacao(labels, elevacao);
    
    console.log(this.cadastro);
  }

  async loadGraficoElevacao(labels:any, valores2:any){

    var canvas:any = document.getElementById('graficoElevacaoRota');
    var ctx = canvas.getContext('2d');
    
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
              {
                label: 'Performance Elevação',
                data: valores2,
                backgroundColor:'rgba(255,255,255,0.0)',
                borderColor:'#DB541E',
                borderWidth:'1',
                fill: false,
            }/*,
            {
                label: 'Performance Km',
                data: valores1,
                backgroundColor:'rgba(251, 231, 118, 0.40)',
                borderColor:'rgba(251, 231, 118, 0.40)',
                borderWidth:'1',
                fill: true,
            }*/
          ]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            animation: {
              easing: 'easeInOutQuad',
              duration: 3850
            },
            legend: {
              display: false
            },
            tooltips: {
              enabled: false
            }
        }
    });
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

  
  async ingressar(){
    let loading = await this.loadingController.create({message:'Carregando...'});
    await loading.present();

    let retorno = await this.service.post("rotasingressar/" + this.cadastro.id,"");
    loading.dismiss();

    this.loadDados();
  }
  async sair(){
    console.log("sair");
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirmação',
      message: 'Deseja realmente excluir da comunidade?',
      buttons: [
        {
          text: 'Não',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Sim',
          handler: async () => {

            console.log("sair sim");

            let loading = await this.loadingController.create({message:'Carregando...'});
            await loading.present();
        
            let retorno = await this.service.put("rotassair/" + this.cadastro.id,"");
            loading.dismiss();
        
            this.loadDados();
          }
        }
      ]
    });
    await alert.present();
  }
  
  async editarPasseio(){
    this.router.navigateByUrl('/popup/rota-semanal-criar?n=' + this.cadastro.id);
  }
  
  async excluirPasseio(){
    
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirmação',
      message: 'Deseja realmente excluir da comunidade?',
      buttons: [
        {
          text: 'Não',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Sim',
          handler: async () => {

            let loading = await this.loadingController.create({message:'Carregando...'});
            await loading.present();
        
            let retorno = await this.service.delete("rotas/" + this.cadastro.id);
            loading.dismiss();
            this.router.navigateByUrl('/home/passeios');
          }
        }
      ]
    });
    await alert.present();
    
  }
  
  async mudarPrivacidade(){
    let loading = await this.loadingController.create({message:'Carregando...'});
    await loading.present();

    let retorno = await this.service.put("rotasprivacidade/" + this.cadastro.id,"");
    loading.dismiss();
    this.loadDados();
  }
  
  async convidarAdmin(){
    
  }


  openMeuPerfil(){ 
    this.router.navigateByUrl('/home/meu-perfil');
  }
  openNotificacoes(){ 
    this.menu.open('end');
  }
  voltar(){ 
    this.router.onSameUrlNavigation ='reload';
    this.router.navigate(['home/' + this.paginaAnterior, {dummyData: (new Date).getTime()}]);
  }
  abrirGPS(){ 
    console.log("Abrir DESTINO SALVO");
    this.router.navigateByUrl('/home/mapa?start=0&tipo=1&dest=' + this.cadastro.endereco);
  }

  async copiar() {
    //this.socialSharing.share("Compartilhando por URL.", null, this.fotoUrl, null);
    console.log("entrou no copiar");
    this.clipboard.copy("https://bike4all.com.br/c/?d=" + this.cadastro.codigoconvite);
    let toast = await this.toastCtrl.create({
      message: 'URL copiada',
      duration: 3000,
      position: 'bottom'
    });
      
    toast.present();
  }
  async compartilhar() {
    //this.socialSharing.share("Compartilhando por URL.", null, this.fotoUrl, null);
    console.log("entrou no compartilhar");
    //var imagemurl = (this.cadastro.urlimagem!=undefined?this.cadastro.urlimagem:'');
    var conviteurl = "https://bike4all.com.br/c/?d=" + this.cadastro.codigoconvite;


    this.socialSharing.share("Venha para nossa rota semanal ", null, null, conviteurl);
  }

  iniciarRota(){ 
    console.log("Abrir PASSEIO NO MAPA");
    this.router.navigateByUrl('/home/mapa?start=1&tipo=2&dest=' + this.cadastro.destinofinal +'&id=' + this.cadastro.id);
  }
  
  async changeRota(dia:any){
    var obj = { origem:"rota_status",id: this.cadastro.id, dia: dia,diasemana: dia, horario:'' };
    if(dia=="seg")
    {
      obj.horario= !this.cadastro.segbool ? "block":"";
      obj.diasemana = "segunda";
      //alert(!this.cadastro.segbool);
      //alert(("#toggleDiaSemanaSegunda").attr());
    }
    if(dia=="ter")
    {
      obj.horario= !this.cadastro.terbool ? "block":"";
      obj.diasemana = "terça";
      //alert(!this.cadastro.terbool);
      //alert(("#toggleDiaSemanaSegunda").attr());
    }
    if(dia=="qua")
    {
      obj.horario= !this.cadastro.quabool ? "block":"";
      obj.diasemana = "quarta";
      //alert(!this.cadastro.quabool);
      //alert(("#toggleDiaSemanaSegunda").attr());
    }
    if(dia=="qui")
    {
      obj.horario= !this.cadastro.quibool ? "block":"";
      obj.diasemana = "quinta";
      //alert(!this.cadastro.quibool);
      //alert(("#toggleDiaSemanaSegunda").attr());
    }
    if(dia=="sex")
    {
      obj.horario= !this.cadastro.sexbool ? "block":"";
      obj.diasemana = "sexta";
      //alert(!this.cadastro.sexbool);
      //alert(("#toggleDiaSemanaSegunda").attr());
    }
    if(dia=="sab")
    {
      obj.horario= !this.cadastro.sabbool ? "block":"";
      obj.diasemana = "sabado";
      //alert(!this.cadastro.sabbool);
      //alert(("#toggleDiaSemanaSegunda").attr());
    }
    if(dia=="dom")
    {
      obj.horario= !this.cadastro.dombool ? "block":"";
      obj.diasemana = "domingo";
      //alert(!this.cadastro.dombool);
      //alert(("#toggleDiaSemanaSegunda").attr());
    }
    
    let retorno = await this.service.post("notificacoes",obj);
  }

}
