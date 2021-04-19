import { Component, OnInit, NgZone  } from '@angular/core';
import { MenuController, Platform, LoadingController, ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';
import { EscolharotaComponent } from 'src/app/components/escolharota/escolharota.component';

declare var google;
@Component({
  selector: 'app-rota-semanal-criar',
  templateUrl: './rota-semanal-criar.page.html',
  styleUrls: ['./rota-semanal-criar.page.scss'],
})
export class RotaSemanalCriarPage implements OnInit {

  
  paginaAnterior:any="comunidades";
  usarRota:false;
  foto: string='';
  rota:any[];
  public cadastro:any={};
  public destinos= []; 
  public fotoUrl="";
  public base64Image:any; 

  public search:string='';
  map:any;
  private googleAutocomplete = new google.maps.places.AutocompleteService();
  private directionsService = new google.maps.DirectionsService();
  private directionsRenderer = new google.maps.DirectionsRenderer({ suppressMarkers: true});  
    

  constructor(private menu: MenuController
    , private router : Router
    , private service: AuthService
    , private plt: Platform
    , private ngZone:NgZone
    , private loadingController: LoadingController
    , private modal:ModalController
    ) { }


  async ngOnInit() {

    this.plt.ready().then(()=>{
      //this.loadStoredImages();
    });
  }
  public ionViewWillEnter(): void {
    this.loadDados();
  }
    
  async loadDados(){
    
    let ref = this.plt.getQueryParam("ref");
    if(ref!=null && ref!=""){
      this.paginaAnterior = ref;
    }

    let id = await this.plt.getQueryParam("n");
    console.log(id);
    if(id!=null && id!="0")
    {
      let loading = await this.loadingController.create({message:'Carregando...'});
      await loading.present();
  
      let id = this.plt.getQueryParam("n");
      console.log(id);
      let retorno = await this.service.get("rotas/" + id);
      loading.dismiss();
      retorno.cadastro.seg=retorno.cadastro.seg=="1" ? true: false;
      retorno.cadastro.ter=retorno.cadastro.ter=="1" ? true: false;
      retorno.cadastro.qua=retorno.cadastro.qua=="1" ? true: false;
      retorno.cadastro.qui=retorno.cadastro.qui=="1" ? true: false;
      retorno.cadastro.sex=retorno.cadastro.sex=="1" ? true: false;
      retorno.cadastro.sab=retorno.cadastro.sab=="1" ? true: false;
      retorno.cadastro.dom=retorno.cadastro.dom=="1" ? true: false;
      this.cadastro = retorno.cadastro;
      this.destinos = retorno.destinos;
      
      if(this.destinos.length>0){
        this.cadastro.partida=this.destinos[0].endereco;
      }
      
      this.iniciaRotas();
    }
    else{
        
      let idcomunidade = await this.plt.getQueryParam("idcomunidade");
      console.log(idcomunidade);

      this.cadastro = { comunidadeid: idcomunidade, privacidade:'publico',titulo:'', descricao:'', partida:''
                        , seg:false, ter:false, qua:false, qui:false, sex:false, sab:false, dom:false
                        , horario:'06:00', niveldificuldade:'moderada' };
      this.destinos = []; //retorno.destinos;
      this.rota=[];
      
    }
  }

  async salvarDados(){
    
    let loading = await this.loadingController.create({message:'Carregando...'});
    await loading.present();

    if(this.cadastro.id>0)
    {
      var obj = this.cadastro; //{ cadastro: this.cadastro, destinos: this.destinos };
      obj.destinos = this.destinos ;
      console.log(obj);
      let retorno = await this.service.put("rotas/" + this.cadastro.id, obj);
      loading.dismiss();

      this.voltar();
    }
    else{
      var obj = this.cadastro; //{ cadastro: this.cadastro, destinos: this.destinos };
      obj.destinos = this.destinos ;
      console.log(obj);
      let retorno = await this.service.post("rotas", obj);
      loading.dismiss();

      this.voltar();
    }

  }
  async incluirDestino(busca:any){
    this.destinos.push({endereco:busca.description});
    if(this.destinos.length==1)
      this.cadastro.partida=busca.description;
    this.search="";
    this.iniciaRotas();
  }
  async removerDestino(obj:any){
    
    const index: number = this.destinos.indexOf(obj);
    this.destinos.splice(index, 1);
    //this.destinos = this.destinos.filter(item => item !== obj);

    if(this.destinos.length==0)
      this.cadastro.partida="";
  }

  openNotificacoes(){ 
    this.menu.open('end');
  }
  openMeuPerfil(){ 
    this.router.navigateByUrl('/home/meu-perfil');
  }
  voltar(){ 
    this.router.onSameUrlNavigation ='reload';
    this.router.navigate(['home/' + this.paginaAnterior, {dummyData: (new Date).getTime()}]);
  }
  
  

  async usarRotaSalva(){
    
    var obj = {};
    const myModal = await this.modal.create({
      component: EscolharotaComponent,
      componentProps: { dados: obj },
      cssClass: 'my-custom-modal-css'
    });
    
    myModal.onDidDismiss()
      .then((ret) => {
        if(ret.data.data=="escolheu"){
          this.destinos=ret.data.destinos;
          
          if(this.destinos.length==1)
            this.cadastro.partida=this.destinos[0].endereco;
          this.search="";


          this.iniciaRotas();
        }
    });

    return await myModal.present();
  }

  /*FUNCOES PARA MAPA */
  searchResults=[];
  searchChanged(item:any){
    if(!item.trim().length) return;
    this.googleAutocomplete.getPlacePredictions({input: item}, predictions => {
      this.ngZone.run(()=>{
        this.searchResults = predictions;
      });
    });/**/
    //this.iniciaRotas("");
  }
  
  
  async iniciaRotas() {
    console.log("INICIANDO FUNÇÃO PARA GERAR O MAPA GOOGLEMAPS");
    
    if(this.destinos.length > 0 && this.cadastro.partida != "")
    {
      var localizacaoCentro = {lat: -22.915, lng: -43.197};
      var mapOption = { zoom:18, center: localizacaoCentro
        ,disableDefaultUI:true
        ,mapTypeId: google.maps.MapTypeId.ROADMAP
        ,mapTypeControl: false
        ,streetViewControl: false
        ,fullscreenControl: false
        //,styles: this.estilos
      };

      this.map = await new google.maps.Map(document.getElementById('mapaGoogle'), mapOption);
      this.directionsRenderer.setMap(this.map);

      var bikeLayer = new google.maps.BicyclingLayer();
      bikeLayer.setMap(this.map);
  
      var elevator = new google.maps.ElevationService();

      var enderecoFinal = this.destinos[this.destinos.length-1].endereco;
      var waypts=[];

      for (var i = 1; i < this.destinos.length; i++) {
          waypts.push({ location: this.destinos[i].endereco, stopover: true });
      }

      /*
      var to = new google.maps.LatLng(this.posicaoAtual.lat, this.posicaoAtual.lng);
      
      new google.maps.Polyline({
        map: this.map,
        path: this.path,
        strokeColor: '#F9D699',
        strokeOpacity: 1,
        strokeWeight: 7
      });*/

      const _self = this
      await this.directionsService.route({
        origin: this.cadastro.partida,
        destination: enderecoFinal,
        waypoints: waypts,
        optimizeWaypoints: true,
        travelMode: 'BICYCLING'
      }, function(result, status) {
        console.log(status);
        console.log(result);
        if (status === 'OK') {
          if(result.routes.length>0){
            _self.rota = result.routes[0].legs;
            _self.cadastro.distancia=0;
            _self.cadastro.tempo=0;
            _self.cadastro.menorelevacao=0;
            _self.cadastro.maiorelevacao=0;
            _self.cadastro.labels="";
            _self.cadastro.elevacoes="";

            for(var i=0; i<result.routes[0].legs.length; i++)
            {
              console.log(result.routes[0].legs[i]);
              _self.cadastro.distancia+=result.routes[0].legs[i].distance.value;
              _self.cadastro.tempo+=result.routes[0].legs[i].duration.value;
              /*for(var j=0; i<result.routes[0].steps.length; j++)
              {
                
              }*/
            }
            _self.cadastro.distancia = _self.cadastro.distancia/1000;

            var location=[];
            var kilometros=[];
            var labels=[];
            var elevacao=[];
            var distancia=0.00;


            for (var j = 0; j < result.routes[0].legs.length; j++) {
              var steps = result.routes[0].legs[j].steps;
              //location.push({lat: steps[0].start_location.lat(),lng: steps[0].start_location.lng()});
              for (var i = 0; i < steps.length; i++) {
                distancia += steps[i].distance.value;
                labels.push((distancia/1000).toFixed(2) + "km"); //steps[i].distance.text);
                kilometros.push(steps[i].distance.value);
                location.push({lat: steps[i].end_location.lat(),lng: steps[i].end_location.lng()});

                if(_self.cadastro.labels!="") _self.cadastro.labels+=",";
                _self.cadastro.labels += (distancia/1000).toFixed(2) + "km";

              }
            }
            
            var elevator = new google.maps.ElevationService;
            elevator.getElevationForLocations({'locations': location}, function(results, status) {
              
              if (status === 'OK') {

                for (var i = 0; i < results.length; i++) {
                  if(_self.cadastro.menorelevacao > results[i].elevation || _self.cadastro.menorelevacao==0) _self.cadastro.menorelevacao = results[i].elevation;
                  if(_self.cadastro.maiorelevacao < results[i].elevation || _self.cadastro.menorelevacao==0) _self.cadastro.maiorelevacao = results[i].elevation;

                  elevacao.push(results[i].elevation);
                  if(_self.cadastro.elevacoes!="") _self.cadastro.elevacoes+=",";
                  _self.cadastro.elevacoes += results[i].elevation + "";
                }
                
                //este.loadGrafico(labels,kilometros,elevacao);
                
              } else {
                console.log('Elevation service failed due to: ' + status);
              }
            });


          }
          _self.directionsRenderer.setDirections(result);
        }
        
      });

      //var endereco="Rua Jurubatuba, 683, Vila Pires, Santo André, SP";
      /*
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode( { 'address': this.endereco}, function(resultado, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          
            var localizacaoCentro = {lat: parseFloat(resultado[0].geometry.location.lat()), lng: parseFloat(resultado[0].geometry.location.lng())};
              
            //criaMarcador(marcador, map)
          } else {
            alert('Erro ao converter endereço: ' + status);
          }
      });*/
    }
  }
  /*FIM FUNCOES PARA MAPA */
  
}
