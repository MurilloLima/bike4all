import { Component, OnInit,  NgZone  } from '@angular/core';
import { MenuController, Platform, ActionSheetController,  LoadingController, ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
import { Camera, CameraOptions, PictureSourceType} from '@ionic-native/camera/ngx';
import { Router } from '@angular/router';
import { EscolharotaComponent } from 'src/app/components/escolharota/escolharota.component';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';

declare var google;

@Component({
  selector: 'app-passeios-criar',
  templateUrl: './passeios-criar.page.html',
  styleUrls: ['./passeios-criar.page.scss'],
})
export class PasseiosCriarPage implements OnInit {
  
  usarRota:false;
  foto: string='';
  public cadastro:any={};
  public fotos:any[];  
  public destinos= []; 
  public fotoUrl="";
  public base64Image:any; 
  rota:any[];
  public search:string='';
  map:any;
  private googleAutocomplete = new google.maps.places.AutocompleteService();
  private directionsService = new google.maps.DirectionsService();
  private directionsRenderer = new google.maps.DirectionsRenderer({ suppressMarkers: true});
  
  images = [];

  constructor(private menu: MenuController
    , private router : Router
    , private service: AuthService
    , private camera: Camera
    , private ngZone:NgZone
    , private actionSheetController: ActionSheetController
    , private plt: Platform
    , private loadingController: LoadingController
    , private modal:ModalController
    , private localNotifications: LocalNotifications) {
      this.rota=[];
     }

      async agendarNotifiacao(titulo:any, texto:any,  data:any){
        
        // Schedule delayed notification
        this.localNotifications.schedule({
          title: titulo,
          text: texto,
          trigger: {at: data}
        });
      }
  async ngOnInit() {
    this.plt.ready().then(()=>{
      //this.loadStoredImages();
    });
  }
  
  public ionViewWillEnter(): void {
    this.loadDados();
  }
    
  async loadDados(){
    
    let id = await this.plt.getQueryParam("n");
    console.log(id);
    if(id!=null && id!="0")
    {
      let loading = await this.loadingController.create({message:'Carregando...'});
      await loading.present();
  
      let id = this.plt.getQueryParam("n");
      let retorno = await this.service.get("passeios/" + id);
      loading.dismiss();
  
      this.cadastro = retorno.cadastro;
      this.destinos = retorno.destinos;
      
      if(this.destinos.length>0){
        this.cadastro.partida=this.destinos[0].endereco;
      }

      this.fotoUrl = this.cadastro.urlimagem;
      this.iniciaRotas();
    }
    else{
      let id = this.plt.getQueryParam("idcomunidade");
      this.cadastro = { comunidadeid: id, titulo:'', descricao:'', partida:'', privacidade:'publico', dia:'', mes:'', ano:'',niveldificuldade:'moderada' };
      this.destinos = []; //retorno.destinos;
      this.rota=[];
      console.log(this.cadastro);
    }
  }
  async salvarDados(){
    
    console.log(this.cadastro);
    this.cadastro.urlimagem = this.fotoUrl;

    var hoje = new Date();
    var data = new Date(Date.parse(this.cadastro.ano+"-"+this.cadastro.mes+"-"+this.cadastro.dia+"T23:59"));
    var dataNot1 = new Date(Date.parse(this.cadastro.ano+"-"+this.cadastro.mes+"-"+this.cadastro.dia+"T00:00"));
    var dataNot2 = new Date(new Date(Date.parse(this.cadastro.ano+"-"+this.cadastro.mes+"-"+this.cadastro.dia+"T"+this.cadastro.horario)).getTime()-300000);
    
    
    if(hoje>data){
      alert("Você não pode agendar para datas no passado");
      return;
    }

    let loading = await this.loadingController.create({message:'Carregando...'});
    await loading.present();

    if(this.cadastro.id>0)
    {
      var obj = this.cadastro; //{ cadastro: this.cadastro, destinos: this.destinos };
      obj.destinos = this.destinos;
      obj.rota = this.rota;
      console.log(obj);
      let retorno = await this.service.put("passeios/" + this.cadastro.id, obj);
      loading.dismiss();
      this.agendarNotifiacao(this.cadastro.titulo,"Fique atento ao passeio de hoje",dataNot1);
      this.agendarNotifiacao(this.cadastro.titulo,"Seu passeio já vai iniciar",dataNot2);
      this.voltar();
    }
    else{
      var obj = this.cadastro; //{ cadastro: this.cadastro, destinos: this.destinos };
      obj.destinos = this.destinos ;
      obj.rota = this.rota;
      console.log(obj);
      let retorno = await this.service.post("passeios", obj);
      loading.dismiss();
      this.agendarNotifiacao(this.cadastro.titulo,"Fique atento ao passeio de hoje",dataNot1);
      this.agendarNotifiacao(this.cadastro.titulo,"Seu passeio já vai iniciar",dataNot2);

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
    this.router.navigate(['home/passeios', {dummyData: (new Date).getTime()}]);
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
      console.log(this.cadastro.partida);
      console.log(enderecoFinal);
      console.log(waypts);

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

  /*FUNCOES PARA IMAGEM */
  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
        header: "Selecionar imagem da",
        buttons: [{
                text: 'Galeria',
                handler: () => {
                    this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
                }
            },
            {
                text: 'Camera',
                handler: () => {
                    this.takePicture(this.camera.PictureSourceType.CAMERA);
                }
            },
            {
                text: 'Cancelar',
                role: 'cancel'
            }
        ]
    });
    await actionSheet.present();
  }
  takePicture(sourceType: PictureSourceType) {
    var options: CameraOptions = {
        quality: 100,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        sourceType: sourceType,
        saveToPhotoAlbum: false,
        correctOrientation: true
    };
 
    this.camera.getPicture(options).then((imageData) => {
      this.base64Image = "data:image/jpeg;base64," + imageData;
     
      this.uploadImage();
    });
 
  }
  async uploadImage(){
    
    let loading = await this.loadingController.create({message:'Carregando...'});
    await loading.present();

    let ret = await this.service.postAny("v1/upload?var=postAny",{ image: this.base64Image });
    loading.dismiss();

    this.fotoUrl = ret.image_url;
  }
  /*FIM FUNCOES PARA IMAGEM*/
}
