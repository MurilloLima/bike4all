import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { Component, OnInit } from '@angular/core';
import { MenuController, Platform, LoadingController, AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { SocialSharing} from '@ionic-native/social-sharing/ngx'
import { Clipboard } from '@ionic-native/clipboard/ngx';

declare var google;
declare var Chart;

@Component({
  selector: 'app-passeios-detalhe',
  templateUrl: './passeios-detalhe.page.html',
  styleUrls: ['./passeios-detalhe.page.scss'],
})
export class PasseiosDetalhePage implements OnInit {

  
  public cadastro:any= { urlimagem:''};  
  public destinos:any[];
  constructor(private menu: MenuController
    , private router : Router
    , private service: AuthService
    , private plt: Platform
    , private loadingController: LoadingController
    , private alertController: AlertController
    , private socialSharing: SocialSharing
    , private clipboard: Clipboard
    , private toastCtrl: ToastController
    , private localNotifications: LocalNotifications) { }

  async agendarNotifiacao(titulo:any, texto:any,  data:any){
    
    // Schedule delayed notification
    this.localNotifications.schedule({
      title: titulo,
      text: texto,
      trigger: {at: data},
      led: 'FF0000',
      sound: null
    });
  }
  async ngOnInit() {
    //this.loadGrafico();
  }

  public ionViewWillEnter(): void {
    this.loadPasseios();

    
  }

  async loadPasseios(){
    
    let loading = await this.loadingController.create({message:'Carregando...'});
    await loading.present();

    let id = this.plt.getQueryParam("n");
    let retorno = await this.service.get("passeios/" + id+"?data=" + this.dataAtualFormatada());
    loading.dismiss();

    this.cadastro = retorno.cadastro;
    this.destinos = retorno.destinos;

    var elevacao=[];
    var labels=[];
    if(retorno.cadastro.elevacoes!=null )elevacao=retorno.cadastro.elevacoes.split(",");
    if(retorno.cadastro.labels!=null )labels=retorno.cadastro.labels.split(",");

    await this.loadGraficoElevacao(labels, elevacao);
    
    let coords = await this.service.getCoordenadas(this.cadastro.endereco);
    let clima = await this.service.getClimaLatLng(coords.results[0].geometry.location.lat, coords.results[0].geometry.location.lng);
    this.cadastro.previsaotempo = clima.main.temp; 
    this.cadastro.previsaoceu = clima.weather[0].description;

    
    
  }

  async loadGraficoElevacao(labels:any, valores2:any){

    var canvas:any = document.getElementById('graficoElevacaoPasseio');
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

    let retorno = await this.service.post("passeiosingressar/" + this.cadastro.id,"");
    loading.dismiss();
    
    var dataNot1 = new Date(Date.parse(this.cadastro.ano+"-"+this.cadastro.mes+"-"+this.cadastro.dia+"T00:00"));
    var dataNot2 = new Date(new Date(Date.parse(this.cadastro.ano+"-"+this.cadastro.mes+"-"+this.cadastro.dia+"T"+this.cadastro.horario)).getTime()-300000);
    
    this.agendarNotifiacao(this.cadastro.titulo,"Fique atento ao passeio de hoje",dataNot1);
    this.agendarNotifiacao(this.cadastro.titulo,"Seu passeio já vai iniciar",dataNot2);

    this.loadPasseios();
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
        
            let retorno = await this.service.put("passeiossair/" + this.cadastro.id,"");
            loading.dismiss();
        
            this.loadPasseios();
          }
        }
      ]
    });
    await alert.present();
  }
  
  async editarPasseio(){
    this.router.navigateByUrl('/popup/passeios-criar?n=' + this.cadastro.id);
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
        
            let retorno = await this.service.delete("passeios/" + this.cadastro.id);
            loading.dismiss();
            this.voltar();
          }
        }
      ]
    });
    await alert.present();
    
  }
  
  async mudarPrivacidade(){
    let loading = await this.loadingController.create({message:'Carregando...'});
    await loading.present();

    let retorno = await this.service.put("passeiosprivacidade/" + this.cadastro.id,"");
    loading.dismiss();
    this.loadPasseios();
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
    this.router.navigate(['home/passeios', {dummyData: (new Date).getTime()}]);
  }
  
  abrirGPS(){ 
    console.log("Abrir DESTINO SALVO");
    this.router.navigateByUrl('/home/mapa?start=0&tipo=1&dest=' + this.cadastro.endereco);
  }

  
  iniciarPasseio(){ 
    console.log("Abrir PASSEIO NO MAPA");
    var destinofinal = this.destinos[this.destinos.length-1].endereco;

    this.router.navigateByUrl('/home/mapa?start=1&tipo=1&dest=' + destinofinal +'&id=' + this.cadastro.id);
  }
  
  convertTempo(totalSegundos:any, tipo:any):string{
    

    if(totalSegundos==null || totalSegundos==undefined || totalSegundos=="")
      return "0 seg";

    var horas="";
    var minutos="";
    var segundos="";
    // Appends 0 when unit is less than 10

    var totalSeconds = Number.isNaN(totalSegundos) ? 0 : parseFloat(totalSegundos); // don't forget the second param
    var hours   = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    var minutes = Math.floor(totalSeconds / 60);
    var seconds = totalSeconds % 60;

    if (hours   < 10) { horas   = "0"+hours; } else { horas = hours.toString(); }
    if (minutes < 10) { minutos = "0"+minutes; } else { minutos = minutes.toString(); }
    if (seconds < 10) { segundos = "0"+seconds; } else { segundos = seconds.toString(); }
    
    
    if(tipo=="horas"){
      if(hours > 0)
        return hours.toString() + "h" + (minutes > 0 ? minutos + " " : "");
      else if(minutes > 0)
        return minutes.toString() + " min";
      else
        return seconds.toString() + " seg";
    }
    else{
      var tempo = horas+':'+minutos+':'+segundos;
      return tempo;
    }
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
    this.compartilhar();
  }
  async compartilhar() {
    //this.socialSharing.share("Compartilhando por URL.", null, this.fotoUrl, null);
    console.log("entrou no compartilhar");
    var imagemurl = (this.cadastro.urlimagem!=undefined?this.cadastro.urlimagem:'');
    var conviteurl = "https://bike4all.com.br/c/?d=" + this.cadastro.codigoconvite;


    this.socialSharing.share("Venha participar do passeio ", null, imagemurl, conviteurl);
  }
  
}
