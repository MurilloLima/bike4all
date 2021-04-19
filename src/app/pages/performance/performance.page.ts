import { Component, OnInit } from '@angular/core';
import { MenuController, LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';

declare var Chart;

@Component({
  selector: 'app-performance',
  templateUrl: './performance.page.html',
  styleUrls: ['./performance.page.scss'],
})


export class PerformancePage implements OnInit {

  public tipodados:any="geral";
  public dados: any=new Array<any>();
  public passeios: any=new Array<any>();
  public rotas: any=new Array<any>();
  public destinos: any=new Array<any>();

  public grafico: any=new Array<any>();
  public graficoDados: any = {};
  public datainicio: any = "";
  public datainicioGrafico: any = "";
  public datafim: any = "";
  public datafimGrafico: any = "";
  public descricaoDataGrafico: any = "";
  public descricaoData: any = "";
  public tipoGrafico: any = "tempo";

  constructor(private menu: MenuController,private router : Router, private service: AuthService, private loadingController: LoadingController) { }

  async ngOnInit() {
    //await this.loadPerformance("semana");
    //await this.loadPerformanceGrafico("semana");
  }
  public ionViewWillEnter(): void {
    this.load("geral");
  }
  
  async load(tipo:any)
  {
    this.tipodados=tipo;
    this.loadPerformance(tipo);
    this.loadPerformanceGrafico(tipo);
    
    let retornoPasseios = await this.service.get("performance-tipo/passeio");
    this.passeios = retornoPasseios.dados;

    let retornoRotas = await this.service.get("performance-tipo/rota");
    this.rotas = retornoRotas.dados;

    let retornoDestinos = await this.service.get("performance-tipo/destino");
    this.destinos = retornoDestinos.dados;
  }

  async loadPerformanceGrafico(tempo:string){
    let loading = await this.loadingController.create({message:'Carregando...'});
    await loading.present();

    var obj={combo: (tempo ==""? "geral" : tempo), data1: this.datainicioGrafico, data2: this.datafimGrafico};
    let retorno = await this.service.getPerformanceGrafico(obj);

    this.grafico = retorno;
    this.graficoDados = retorno.dados[0];
    this.datainicioGrafico = retorno.data1;
    this.datafimGrafico = retorno.data2;
    this.descricaoDataGrafico = retorno.descricaodata;


    loading.dismiss();

    this.loadGrafico("tempo");
  }

  async loadPerformance(tempo:string){
    let loading = await this.loadingController.create({message:'Carregando...'});
    await loading.present();

    var obj={combo: (tempo ==""? "geral" : tempo), data1: this.datainicio, data2: this.datafim};
    let retorno = await this.service.getPerformance(obj);
    loading.dismiss();

    this.dados = retorno.dados[0];
    this.datainicio = retorno.data1;
    this.datafim = retorno.data2;
    this.descricaoData = retorno.descricaodata;
    console.log(retorno);
  }

  async changeTempoGrafico(){
    this.loadPerformanceGrafico($("#ddltempoGrafico").val().toString());
  }
  async changeTempo(){
    this.loadPerformance($("#ddltempo").val().toString());
  }
    
  openNotificacoes(){ 
    this.menu.open('end');
  }
  openMeuPerfil(){ 
    this.router.navigateByUrl('/popup/meu-perfil');
  }
  openPasseio(id:any){ 
    this.router.navigateByUrl('/popup/performance-passeio?n=' + id + "&tipo=passeio");
  }
  openRota(id:any){ 
    this.router.navigateByUrl('/popup/performance-rota?n=' + id + "&tipo=rota");
  }

  openDestino(id:any, tipo:any){ 
    this.router.navigateByUrl('/popup/performance-destino?n=' + id + "&tipo=" + tipo);
  }


  loadGrafico(tipo:any){
    this.tipoGrafico=tipo;

    var dadosGraf = [];
    if(tipo=="velocidade"){ dadosGraf = this.grafico.velocidade; }
    else if(tipo=="distancia") { dadosGraf = this.grafico.distancia; }
    else if(tipo=="calorias") { dadosGraf = this.grafico.calorias; }
    else { dadosGraf = this.grafico.tempo; }
    
    var canvas:any = document.getElementById('graficoPerformance');
    var ctx = canvas.getContext('2d');
    var gradient = ctx.createLinearGradient(219, 84, 30, 1);
    gradient.addColorStop(0, 'rgba(219, 84, 30, 1)');
    gradient.addColorStop(1, 'rgba(241, 204, 0, 1)'); 
    
    var labels=[];
    var valores=[];
    var bgColors=[];
    var bgHoverColors=[];
    var bgBorderColors=[];
    for(let i=0; i < dadosGraf.length;i++){
      labels.push(dadosGraf[i].data);
      valores.push(dadosGraf[i].valor);
      bgColors.push(gradient);
      bgHoverColors.push(gradient);
      bgBorderColors.push('rgba(255, 255, 255, 0)');
      
    }
    console.log("labels");
    console.log(labels);
    console.log("valores");
    console.log(valores);

    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Performance',
                data: valores,
                backgroundColor:'rgba(255,255,255,0.0)',
                borderColor:'#DB541E',
                borderWidth:'1',
                fill: false,
            }]
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
              duration: 1500
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
}
