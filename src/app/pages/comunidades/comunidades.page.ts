import { Component, OnInit } from '@angular/core';
import { MenuController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-comunidades',
  templateUrl: './comunidades.page.html',
  styleUrls: ['./comunidades.page.scss'],
})
export class ComunidadesPage implements OnInit {
  public comunidades:any[];
  public comunidades_proxima:any[];
  public minhascomunidades:any[];
  public rotas:any[] ;
  public local="";
  slideOpts = {
    initialSlide: 0,
    slidesPerView:2,
    autoplay: {
      delay: 5000,
    },
    speed: 400
  };
  
  constructor(private geolocation:Geolocation,private menu: MenuController,private router : Router, private service: AuthService, private loadingController: LoadingController) { }

  ngOnInit() {
  
    //await this.loadDados();
  }
public ionViewDidEnter():void{
  
  console.log("entrouDID");
}
  public ionViewWillEnter(): void {
    console.log("entrou");
    this.loadDados(true);
  }
  
  async loadDados(load:any){
    
    var obj = { lat: 0, lng: 0 };
    await this.geolocation.getCurrentPosition({enableHighAccuracy:true}).then(async (resp)=>{
      
      obj = {
        lat: parseFloat(resp.coords.latitude.toString()), 
        lng: parseFloat(resp.coords.longitude.toString())
      };
    }).catch(async (error)=>{
      
    });
    //let loading = await this.loadingController.create({message:'Carregando...'});
    //await loading.present();
    
    var filtro = "local=" + this.local + "&lat=" + obj.lat + "&lng=" + obj.lng;

    let loading = await this.loadingController.create({message:'Carregando...'});
    if(load)
      await loading.present();

    let retorno = await this.service.get("comunidades?local=" + this.local);
    
    if(load)
      loading.dismiss();

    this.comunidades = retorno.comunidades;
    this.minhascomunidades = retorno.minhascomunidades;
    this.comunidades_proxima = retorno.comunidades_proxima;
    this.rotas = retorno.rotas;
  }
  
  openNotificacoes(){ 
    this.menu.open('end');
  }
  criar(){ 
    this.router.navigateByUrl('/popup/comunidades-criar');
  }
  openDetalhe(item:any){
    this.router.navigateByUrl('/popup/comunidades-detalhe?n=' + item.id);
  }
  openMinhaComunidade(item:any){
    this.router.navigateByUrl('/popup/comunidades-detalhe?n=' + item.id);
  }
  openRota(item:any){
    console.log(item);
    this.router.navigateByUrl('/popup/rota-semanal?n=' + item.id);
  }
  openPasseio(item:any){
    this.router.navigateByUrl('/popup/passeios-detalhe?n=' + item.id);
  }
  openMeuPerfil(){ 
    this.router.navigateByUrl('/home/meu-perfil');
  }

}
