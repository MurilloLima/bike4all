import { Component, OnInit } from '@angular/core';
import { MenuController, LoadingController, Platform } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';

declare var Chart;
@Component({
  selector: 'app-performance-passeio',
  templateUrl: './performance-passeio.page.html',
  styleUrls: ['./performance-passeio.page.scss'],
})
export class PerformancePasseioPage implements OnInit {

  public dados: any=new Array<any>();
  public grafico: any=new Array<any>();
  public detalhes: any=new Array<any>();
  public isdetalhes=false;
  
  constructor(private menu: MenuController
            , private router : Router
            , private service: AuthService
            , private plt: Platform
            , private loadingController: LoadingController) { }

  async ngOnInit() {
    //await this.loadPerformance();
  }
  public ionViewWillEnter(): void {
    this.loadPerformance();
  }

  async loadPerformance(){
    let id = this.plt.getQueryParam("n");
    let tipo = this.plt.getQueryParam("tipo");

    let loading = await this.loadingController.create({message:'Carregando...'});
    await loading.present();

    let retorno = await this.service.get("performance-tipo-dados/" + id + "?tipo=" + tipo);
    this.dados = retorno.dados;
    this.grafico = retorno.grafico;
    this.detalhes = retorno.detalhes;

    loading.dismiss();
    
    var labels = []; //KM
    var valores2 = [];
    for(var i=0;i<retorno.grafico.kilometros.length;i++)
    {
      labels.push(retorno.grafico.kilometros[i]+"km");
    }
    for(var i=0;i<retorno.grafico.elevacoes.length;i++)
    {
      valores2.push(retorno.grafico.elevacoes[i]);
    }

    this.loadGraficoElevacao(labels,valores2);
  }
  
  async loadGraficoElevacao(labels:any, valores2:any){

    var canvas:any = document.getElementById('graficoElevacaoPerformancePasseio');
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

    
  openNotificacoes(){ 
    this.menu.open('end');
  }
  voltar(){ 
    if(this.isdetalhes)
      this.isdetalhes=false;
    else
      this.router.navigateByUrl('/home/performance');
  }
  openMeuPerfil(){ 
    this.router.navigateByUrl('/popup/meu-perfil');
  }
  openPasseio(id:any){ 
    this.router.navigateByUrl('/popup/performance-passeio?n=' + id);
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
        return hours.toString() + "h" + (minutes > 0 ? minutos + "" : "");
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
