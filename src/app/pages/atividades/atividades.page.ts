import { Component, OnInit } from '@angular/core';
import { MenuController, LoadingController, AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-atividades',
  templateUrl: './atividades.page.html',
  styleUrls: ['./atividades.page.scss'],
})
export class AtividadesPage implements OnInit {

  public passeios_proximos: any=new Array<any>();
  public passeios_realizados: any=new Array<any>();
  public rotas_semanais: any=new Array<any>();
  public destinos_salvos: any=new Array<any>();
  public gravacoes: any=new Array<any>();
  

  constructor(private menu: MenuController,
    private router : Router, 
    private service: AuthService, 
    private loadingController: LoadingController,
    private alertController: AlertController) { }

  async ngOnInit() {
  }

  public ionViewWillEnter(): void {
    this.loadAtividades();
  }
  
  async loadAtividades(){
    let loading = await this.loadingController.create({message:'Carregando...'});
    await loading.present();

    let retorno = await this.service.get("atividades");
    loading.dismiss();

    this.passeios_proximos = retorno.passeios_proximos;
    this.passeios_realizados = retorno.passeios_realizados;
    this.rotas_semanais = retorno.rotas_semanais;
    this.destinos_salvos = retorno.destinos_salvos;
    this.gravacoes = retorno.destinos_gravados;

    
    for(var i=0; i<this.passeios_proximos.length;i++){

      let coords = await this.service.getCoordenadas(this.passeios_proximos[i].endereco);
      let clima = await this.service.getClimaLatLng(coords.results[0].geometry.location.lat, coords.results[0].geometry.location.lng);
      this.passeios_proximos[i].previsaotempo = clima.main.temp + 'ºC'; 
      this.passeios_proximos[i].previsaoceu = clima.weather[0].description;
    }
    
  }
    
  openNotificacoes(){ 
    this.menu.open('end');
  }
  openPasseioRealizado(item:any){ 
    console.log("Abrir PASSEIO REALIZADO");
    this.router.navigateByUrl('/popup/passeios-detalhe?n=' + item.id);
  }
  openPasseioProximo(item:any){ 
    console.log("Abrir PASSEIO PROXIMO");
    this.router.navigateByUrl('/popup/passeios-detalhe?n=' + item.id);
  }
  async openDestinoSalvo(item:any){ 
    console.log("Abrir DESTINO SALVO");

    
    const alert = await this.alertController.create({
      header: 'Nome da gravação',
      inputs: [
        {
          name: 'nome',
          type: 'text',
          placeholder: 'Informe o nome da gravação',
          value: item.endereco
          //maxlenght:'250'
        }
      ],
      buttons: [
        {
          text: 'Renomear',
          handler: async data => {
            var obj = { tipo: item.tipo, nome: data.nome, id:item.id  };
            await this.service.post("renomeardestino", obj);
            await this.loadAtividades();
          }
        },
        {
          text: 'Excluir',
          handler: async data => {
            
            var obj = { tipo: item.tipo,  nome: "", id:item.id};
            await this.service.post("removerdestino", obj);
            await this.loadAtividades();
          }
        },
        { text: 'Traçar rota', handler: data => {
            this.router.navigateByUrl('/home/mapa?tipo=' + item.tipo + '&dest=' + item.destino);
        }},
        { text: 'Fechar', role: 'cancel', handler: data => { } }
      ]
    });
    await alert.present();
    
  }
  
  openRotaSemanal(item:any){ 
    console.log("Abrir ROTA SEMANAL");
    this.router.navigateByUrl('/popup/rota-semanal?n=' + item.id);
  }
  openMeuPerfil(){ 
    this.router.navigateByUrl('/home/meu-perfil');
  }
  
}
