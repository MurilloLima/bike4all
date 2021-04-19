import { Component, OnInit } from '@angular/core';
import { MenuController, NavController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { PasseiosDetalhePage } from '../passeios-detalhe/passeios-detalhe.page';
import { AuthService } from 'src/app/auth/auth.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-passeios',
  templateUrl: './passeios.page.html',
  styleUrls: ['./passeios.page.scss'],
})
export class PasseiosPage implements OnInit {
  public passeios:any[];
  public meuspasseios:any[];
  public passeiosProximos:any[] ;
  public local="";
  
  constructor(private geolocation:Geolocation,private menu: MenuController,private router : Router, private service: AuthService, private loadingController:LoadingController) { }

  async ngOnInit() {
    let loading = await this.loadingController.create({message:'Carregando...'});
    await loading.present();
    await this.loadDados();
    
    loading.dismiss();
  }

  public ionViewWillEnter(): void {
    this.loadDados();
  }
  async loadDados(){
    
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
    let retorno = await this.service.get("passeios?" + filtro);
    //loading.dismiss();

    this.meuspasseios = retorno.meuspasseios;
    this.passeios = retorno.passeios;
    this.passeiosProximos = retorno.passeios_proximos;

    for(var i=0; i<this.meuspasseios.length;i++){
      try{
        let coords = await this.service.getCoordenadas(this.meuspasseios[i].endereco);
        let clima = await this.service.getClimaLatLng(coords.results[0].geometry.location.lat, coords.results[0].geometry.location.lng);
        this.meuspasseios[i].previsaotempo = clima.main.temp + 'ºC'; 
        this.meuspasseios[i].previsaoceu = clima.weather[0].description;
      } catch{}
    }
    
    for(var i=0; i<this.passeios.length;i++){
      try{
        let coords = await this.service.getCoordenadas(this.passeios[i].endereco);
        let clima = await this.service.getClimaLatLng(coords.results[0].geometry.location.lat, coords.results[0].geometry.location.lng);
        this.passeios[i].previsaotempo = clima.main.temp + 'ºC'; 
        this.passeios[i].previsaoceu = clima.weather[0].description;
    } catch{}
    }
    
    for(var i=0; i<this.passeiosProximos.length;i++){
      try{
        let coords = await this.service.getCoordenadas(this.passeiosProximos[i].endereco);
        let clima = await this.service.getClimaLatLng(coords.results[0].geometry.location.lat, coords.results[0].geometry.location.lng);
        this.passeiosProximos[i].previsaotempo = clima.main.temp + 'ºC'; 
        this.passeiosProximos[i].previsaoceu = clima.weather[0].description;
    } catch{}
    }

  }
  openNotificacoes(){ 
    this.menu.open('end');
  }
  criar(){ 
    this.router.navigateByUrl('/popup/passeios-criar');
  }
  openMeuPasseio(item){
    console.log(item);
    this.router.navigateByUrl('/popup/passeios-detalhe?n=' + item.id);
  }
  openDetalhe(item){
    console.log(item);
    this.router.navigateByUrl('/popup/passeios-detalhe?n=' + item.id);
  }
  openMeuPerfil(){ 
    this.router.navigateByUrl('/home/meu-perfil');
  }


}
