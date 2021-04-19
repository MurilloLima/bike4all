import { Component, OnInit, OnDestroy,  ViewChild, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ILatLng} from '@ionic-native/google-maps'
import { Platform,  AlertController, ActionSheetController } from '@ionic/angular';
import { Insomnia } from '@ionic-native/insomnia/ngx';
import { SocialSharing} from '@ionic-native/social-sharing/ngx'
import { Camera, CameraOptions, PictureSourceType} from '@ionic-native/camera/ngx';
import { LaunchNavigator,LaunchNavigatorOptions } from '@ionic-native/launch-navigator/ngx';

import {
  BackgroundGeolocation,
  BackgroundGeolocationConfig,
  BackgroundGeolocationResponse,
  BackgroundGeolocationEvents
} from "@ionic-native/background-geolocation/ngx";

import { ModalController } from '@ionic/angular';

import { LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription, Observer, Observable } from 'rxjs';
import { MenuController } from '@ionic/angular';
import { PhotoLibrary, LibraryItem, CameraPosition } from 'ionic-native';
import { AlertaDeRouboComponent } from 'src/app/components/alerta-de-roubo/alerta-de-roubo.component';

import * as $ from "jquery";
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';

declare var google;
declare let html2canvas;
declare var Chart;
declare var window;

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})
export class MapaPage implements OnInit , OnDestroy {

  locations:any;
  
  //@ViewChild('imageCanvas',{static: true}) canvas: any;

  @ViewChild('map',{static: true}) mapElement: any;
  gerarCustom:any =false;
  public base64Image:any; 
  foto: string='';
  public fotoUrl="";
  public fotoMapaUrl="";

  private loading: any;
  public search:string='';
  private googleAutocomplete = new google.maps.places.AutocompleteService();
  private directionsService = new google.maps.DirectionsService();
  public searchResults = new Array<any>();
  private marcador:any;
  private marcadorAccuracy:any;
  private polyline:any;
  public destination:any;
  public posicaoDestino:any;
  public rotas: any=new Array<any>();

  public alertasTipo: any=new Array<any>();
  public alertas: any=new Array<any>();
  public bikes: any=new Array<any>();
  /*Tracker*/
  currentMapTrack=null;
  isTracking=false;
  isMoving=false;
  public isGravando=false;
  trackedRoute=[];
  previousRoutes=[];
  positionSubscription: Subscription;
  path=[];
  public rota:any;
  public posicaoAnterior:any;
  public tempo=0;
  private lastTime: Date;
  public velocidade="0";
  public distancia="";
  public distanciaTotal=0;
  public distanciaTotalTempo=0;
  public orientacaoAngulo=0;
  public idtrajeto=0;
  public velocidadeItens=0;
  public velocidadeTotal=0;
  public velocidadeMedia=0;
  public tempoTotal=0;
  public tempoTexto="";
  public tempoTotalTexto="";
  public tempoStart:any;

  /*Diogenes*/
  private directionsDisplay = new google.maps.DirectionsRenderer();
  private directionsDisplayBack = new google.maps.DirectionsRenderer();
  
  map:any;
  markers: any=new Array<any>();
  posicaoAtual:any;
  originPosition:any;
  destinationPosition:string;
  public destinoMapa:any = { titulo:"", endereco:"Av.Dom Pedro", tempo:{text: "0 min", value:0}, distancia:{text:"1km distancia",value:1}, instrucao:""  };
  
  /*Contador*/
  contTempo: any=0;
  interval: any;

  estilos = [ ] ;
  private cursor: any = { url: '/assets/images/gps.svg', size: new google.maps.Size(40, 60), origin: new google.maps.Point(0,0), anchor: new google.maps.Point(40, 24)};
  private cursor2: any = { url: '/assets/images/gps-bike.svg', size: new google.maps.Size(40, 60), origin: new google.maps.Point(0,0), anchor: new google.maps.Point(40, 24) };
  private cursor3: any = { url: '/assets/images/mini.svg', size: new google.maps.Size(20, 20), origin: new google.maps.Point(0,0), anchor: new google.maps.Point(10, 10) };

  private iconeGPS:any;
  
  img: any;


  /*AUTOPASE*/

  private ultimoTempo:any;
  private ultimaPosicao:any;
  private tempoUltima:any;
  /*FIM AUTOPASE*/



  //loading: any;
  constructor(private backgroundGeolocation: BackgroundGeolocation,
            private geolocation:Geolocation, 
            private ngZone:NgZone,
            private launchNavigator: LaunchNavigator,
            private platform:Platform, 
            private loadingCtrl: LoadingController, 
            private router:Router, 
            private menu: MenuController, 
            private camera: Camera,
            private actionSheetController: ActionSheetController, 
            private alertController: AlertController,
            private service: AuthService,
            private insomnia: Insomnia,
            public socialSharing: SocialSharing,
            private modal: ModalController
            , private localNotifications: LocalNotifications) {
              this.locations=[];
                          
              this.platform.backButton.subscribeWithPriority(5, () => {
                //alert('Another handler was called!');
                return;
              });
              
                /*
              this.platform.backButton.subscribeWithPriority(10, (processNextHandler) => {
                console.log('Handler was called!');

                processNextHandler();
              });*/
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
    window['angularComponentReference'] = { component: this, zone: this.ngZone, editarMarcador: (id, tipo) => this.editarMarcador(id, tipo), removerMarcador: (id, tipo) => this.removerMarcador(id, tipo) };  
    

    let dest = this.platform.getQueryParam("dest");
    console.log(dest);
    this.loadTipoAlerta();
    
    await this.inicializaMapa();

    this.loadAlertas();

    if(dest!=null && dest!=""){
      console.log(dest);
      var obj = { description: dest};
      this.calcRoute(obj);
    }

    
    
    this.insomnia.keepAwake()
    .then(
      () => console.log('success'),
      () => console.log('error')
    );
  }
  async convertToDataURLviaCanvas(url, outputFormat){
    return new Promise((resolve, reject) => {
    let img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      let canvas = <HTMLCanvasElement> document.createElement('CANVAS'),
        ctx = canvas.getContext('2d'),
        dataURL;
      canvas.height = 500; //img.height;
      canvas.width = 500; //img.width;
      ctx.drawImage(img, 0, 0);
      dataURL = canvas.toDataURL(outputFormat);
      resolve(dataURL);
      canvas = null;
    };
    //img.onerror = (err) => { console.log(err), reject(err); };
    img.src = url;
  });
}

getBase64ImageFromURL(url: string) {
  return Observable.create((observer: Observer<string>) => {
    let img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = url;
    if (!img.complete) {
      img.onload = () => {
        observer.next(this.getBase64Image(img));
        observer.complete();
      };
      img.onerror = (err) => {
        observer.error(err);
      };
    } else {
      observer.next(this.getBase64Image(img));
      observer.complete();
    }
  });
}

getBase64Image(img: HTMLImageElement) {
  var canvas = document.createElement("canvas");
  canvas.width = 500;//img.width;
  canvas.height = 500;//img.height;
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);
  var dataURL = canvas.toDataURL("image/png");
  return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}
  public ionViewWillEnter(): void {
    console.log('hi');
    let dest = this.platform.getQueryParam("dest");
    let tipo = this.platform.getQueryParam("tipo");
    let id = this.platform.getQueryParam("id");
    let start = this.platform.getQueryParam("start");
    console.log(dest);
    if(dest!=null && dest!="" && tipo!=null && tipo=="1"){
      console.log(dest);
      var obj = { description: dest};
      this.calcRoute(obj);

      if(start=="1"){
        //Inicia passeio
        this.iniciaPercurso(id,0,0,0);
      }
    }
    if(dest!=null && dest!="" && tipo!=null && tipo=="2"){
      console.log(dest);
      var obj = { description: dest};
      this.calcRoute(obj);

      if(start=="1"){
        //Inicia passeio
        this.iniciaPercurso(id,0,0,0);
      }
    }
  }
  ngOnDestroy(){
    console.log("destoi");
    this.insomnia.allowSleepAgain()
    .then(
      () => console.log('success'),
      () => console.log('error')
    );
  }

  async inicializaMapa()
  {
    this.loading = await this.loadingCtrl.create({message:'Por favor, aguarde...'});
    await this.loading.present();

    console.log("INICIANDO FUNÇÃO PARA GERAR O MAPA GOOGLEMAPS");
    const mapOption = { zoom:18
      , disableDefaultUI:true
      , mapTypeId: google.maps.MapTypeId.ROADMAP
      , mapTypeControl: false
      , streetViewControl: false
      , fullscreenControl: false
      , styles: this.estilos
    };
    this.map = new google.maps.Map(document.getElementById('mapa'), mapOption);

    var este = this;
    google.maps.event.addListener(this.map, 'dragend', function() { 
      //alert(este.isMoving); 
      este.isMoving=false;
    } );

    var bikeLayer = new google.maps.BicyclingLayer();
    bikeLayer.setMap(this.map);
    
    this.geolocation.getCurrentPosition().then((resp)=>{
      this.posicaoAtual = {lat: parseFloat(resp.coords.latitude.toString()), lng: parseFloat(resp.coords.longitude.toString())};

      this.map.setCenter(this.posicaoAtual);  
      this.map.setZoom(18);  
      
      this.directionsDisplay.setMap(this.map);       

      this.marcador = new google.maps.Marker({
        position:this.posicaoAtual ,
        map: this.map,
        title: 'Minha posição',
        animation: google.maps.Animation.DROP, //BOUCE
        icon: {
          url: '/assets/images/gps.svg',
          size: new google.maps.Size(40, 60),
          origin: new google.maps.Point(0,0),
          anchor: new google.maps.Point(40, 24)
        }
      });
      google.maps.event.addListener(this.marcador,'click',function(){
        this.aviso("O que significa esse ícone?","Segundo o seu GPS, essa é a sua localização atual");
      });

    }).catch((error)=>{
      //console.log("Erro ao recuperar sua posição",error);
      this.aviso("GPS","Sinal de GPS fora do ar.");
      //this.map.setCenter(this.posicaoAtual);    
      //this.map.setZoom(this.posicaoAtual);    

    });

    
    this.loading.dismiss();
  }

  startBackgroundGeolocation() {
    this.velocidadeItens=0;
    this.velocidadeTotal=0;
    this.isTracking=true;
    this.isMoving=true;
    this.trackedRoute=[];
    this.path=[];
    
    this.iconeGPS = { 
      path: google.maps.SymbolPath.CIRCLE,
      scale:7,
      fillColor: 'gold',
      fillOpacity:1,
      strokeColor: 'white',
      strokeWeight: 3
    };
    //this.marcador.setIcon(this.cursor3);
    this.marcador.setIcon(this.iconeGPS);
    this.marcadorAccuracy = new google.maps.Circle({
      fillColor: '#F9D699',
      fillOpacity: 0.4,
      strokeOpacity: 0,
      map: this.map,
      center: this.posicaoAtual,
      radius:10
    });

    //this.service.post("teste", {modulo:'gps', texto:'start background'} );
    //console.log("start background");
    //window.app.backgroundGeolocation.start();
    
    const config: BackgroundGeolocationConfig = {
      //locationProvider: 0,
      desiredAccuracy: 0,
      notificationsEnabled:true,
      notificationTitle: 'Bike4All gravando',
      notificationText: 'GPS ativo',  
      //activityType: BackgroundGeolocationIOSActivity.Fitness,
      interval:500,
      stationaryRadius: 3,
      distanceFilter: 3,
      //desiredAccuracy: 10,
      debug: false, //  enable this hear sounds for background-geolocation life-cycle.
      stopOnTerminate: true // enable this to clear background location settings when the app terminates,
      //saveBatteryOnBackground: true
    };

    //console.log("entrou back");
    //this.service.post("teste", {modulo:'gps', texto:'configurou background'} );
    this.backgroundGeolocation.configure(config).then(() => {
      this.backgroundGeolocation
        .on(BackgroundGeolocationEvents.location)
        .subscribe((location: BackgroundGeolocationResponse) => {
          this.sendGPS(location);
          // IMPORTANT:  You must execute the finish method here to inform the native plugin that you're finished,
          // and the background-task may be completed.  You must do this regardless if your operations are successful or not.
          // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
        });
    });

    // start recording location
    this.backgroundGeolocation.start();

    // If you wish to turn OFF background-tracking, call the #stop method.
    //this.backgroundGeolocation.stop();
  }
  sendGPS(data) {
    this.tempoUltima +=1;

    this.service.post("teste", {modulo:'gps', texto:JSON.stringify(data)} );
    
    if (data.speed == undefined) {
      data.speed = 0;
    }
    let timestamp = new Date(data.time);   

    if(data!=undefined && this.isTracking)
    {
      this.ultimoTempo = new Date();
      this.posicaoAnterior=this.posicaoAtual;            
      this.posicaoAtual = {lat: parseFloat(data.latitude.toString()), lng: parseFloat(data.longitude.toString())};
      console.log(this.posicaoAtual);
    
                
      var from = new google.maps.LatLng(parseFloat(this.posicaoAnterior.lat.toString()), parseFloat(this.posicaoAnterior.lng.toString()));
      var to = new google.maps.LatLng(parseFloat(this.posicaoAtual.lat.toString()), parseFloat(this.posicaoAtual.lng.toString()));

      this.marcador.setPosition(this.posicaoAtual);     

      var dist = google.maps.geometry.spherical.computeDistanceBetween(from, to);
      var km = (dist/1000).toFixed(1); 
      //this.velocidade = (data.coords.speed * 3600)/1000 ; // can be speed * 3.6 and should be round for 2 decimal
      var altitude = Number.isNaN(data.altitude) ? 0 : data.altitude;
      var bearing = Number.isNaN(data.bearing ) ? 0 : data.bearing ;

      this.velocidade = (Number.isNaN(data.speed * 3.6) ? 0 : (data.speed * 3.6)).toFixed(0);
      this.velocidadeMedia = (Number.isNaN(data.speed * 3.6) ? 0 : (data.speed * 3.6));
      if(((Number.isNaN(data.speed * 3.6) ? 0 : (data.speed * 3.6)))>=1){
        this.velocidadeItens++;
        this.velocidadeTotal=this.velocidadeTotal + (Number.isNaN(data.speed * 3.6) ? 0 : (data.speed * 3.6));
      }
      this.distancia = km;
      this.distanciaTotal += (dist/1000);
      this.velocidadeMedia = this.distanciaTotal / (this.tempo/3600);
      this.velocidadeMedia = this.velocidadeItens>0 ? this.velocidadeTotal / this.velocidadeItens : 0;
      
      if(this.isGravando){
        this.distanciaTotalTempo += (dist/1000);
        document.getElementById("gpsDistanciaTempo").innerHTML = this.distanciaTotal.toFixed(1) + " <u>km</u>"; 
      } else {
        var de = new google.maps.LatLng(parseFloat(this.posicaoAtual.lat.toString()), parseFloat(this.posicaoAtual.lng.toString()));
        var ate = new google.maps.LatLng(parseFloat(this.posicaoDestino.lat.toString()), parseFloat(this.posicaoDestino.lng.toString()));
        //this.posicaoDestino
        var distFalta = google.maps.geometry.spherical.computeDistanceBetween(de, ate);
        if(distFalta<=10){ //10 metros
            
          this.agendarNotifiacao("Bike4All","Você chegou ao destino, clique para concluir." , new Date());
          this.concluir();
          return;
        }

        //this.calcRoutDif(to, this.destination);
        //this.recentralizar();
      }
      //this.velocidade = data.coords.speed;
      this.path.push(to); 
      this.trackedRoute.push({lat:data.latitude, lng: data.longitude});

      var obj = { lat: this.posicaoAtual.lat, lng: this.posicaoAtual.lng
        , destino:'', distancia:(dist/1000), tempo:this.tempo, elevacao:altitude
        , velocidademedia:this.velocidadeMedia , idtrajeto:this.idtrajeto, gravacao: (this.isGravando ? "sim" :"não"), horario: timestamp
      };  
      this.service.dadosPercurso(obj);

      this.service.post("teste", {modulo:'gps dados', texto:JSON.stringify(obj)} );
      
      //var center = new google.maps.LatLng( data.coords.latitude, data.coords.longitude);  
      //console.log(center);
      //this.marcador.setIcon(this.cursor3);      

      var latLngBounds = new google.maps.LatLngBounds();
      for(var i = 0; i < this.path.length; i++) {
        latLngBounds.extend(this.path[i]);
      }
      
      //this.service.post("teste", {modulo:'gps', texto:'vai pintar'} );
      // DESENHAR
      if(this.polyline)
        this.polyline.setMap(null);

      this.polyline = new google.maps.Polyline({map: this.map,path: this.path,strokeColor: '#F9D699',strokeOpacity: 1,strokeWeight: 7});

      try{
        
          this.loadAlertasTracking();

        if(this.isMoving) {                 
          this.map.setZoom(18);  
          this.map.setCenter(to); 
          //this.recentralizar(); 
        }



        let cameraPosition: CameraPosition = this.map.getCameraPosition();
        cameraPosition.bearing = 90; // heading of the map

        this.map.animateCamera(bearing);
        this.marcadorAccuracy.setPosition(this.posicaoAtual);
        this.marcadorAccuracy.setRadius(data.accuracy);
      }catch{}
      

      if(!this.isGravando){
        //this.directionsDisplay.setMap(this.map);
      } else {
        //this.directionsDisplay.setMap(this.map);
      }
    }
  }
  stoptBackgroundGeolocation() {
    console.log("stop background");
    try{
    this.backgroundGeolocation.stop();
    } catch{}


    try{
      this.positionSubscription.unsubscribe();
      } catch{}
    
    
    //window.app.backgroundGeolocation.stop();
  }
  
  
  degToRad(n)
  {
    return n * Math.PI / 180;
  }
  radToDeg(n)
  {
    return n * 180 / Math.PI;
  }
  getDistance(lat1, lon1, lat2, lon2, mode)
  {	
    var R = 6371; // Earth radius in km
    
    switch(mode)
    {	
      case 'spherical':
      default:
        var dLon = this.degToRad(lon2 - lon1);
        lat1 = this.degToRad(lat1);
        lat2 = this.degToRad(lat2);
        var d = Math.acos(Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1) * Math.cos(lat2) * Math.cos(dLon)) * R;
      break;	
      
      case 'haversine':
        var dLat = this.degToRad(lat2 - lat1);
        var dLon = this.degToRad(lon2 - lon1);
        lat1 = this.degToRad(lat1);
        lat2 = this.degToRad(lat2);
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2); 
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
        var d = R * c;
      break;	
      
      case 'rectangle':
        var x = this.degToRad(lon2 - lon1) * Math.cos(this.degToRad(lat1 + lat2) / 2);
        var y = this.degToRad(lat2 - lat1);
        var d = Math.sqrt(x * x + y * y) * R;
      break;	
    }
      
    return d;	
  }

  async loadTipoAlerta(){
    let dados = await this.service.getAlertasTipo();
    this.alertasTipo = dados;
  }
  async loadAlertasTracking(){
    let dados = await this.service.getAlertas(this.posicaoAtual.lat,  this.posicaoAtual.lng);
    this.alertas = dados;
    var avisogps=false;
    const points = new Array<ILatLng>();
    for(let i=0; i < this.alertas.length;i++){

      if(this.alertas[i].avisogps=="S"){
        
        try{
          this.agendarNotifiacao("Bike4All",this.alertas[i].nome + ' nas proximidades', new Date());
        } catch{}

        console.log("aviso");
        avisogps=true;
        var htmlAviso = "<div class='sinalizacao'>" +
                        "<img src='/assets/images/" + this.alertas[i].icone + "'> " + this.alertas[i].nome + "</div>";
        $(".caminhos-alertas-topo").html(htmlAviso);
        $("section.caminhos-alertas-topo").show();
        $("section.caminhos-alertas-topo").css("top","0px");
        $("section.caminhos-alertas-topo").css("height","auto");
      }

      points[i] = {
        lat: parseFloat(this.alertas[i].lat),
        lng: parseFloat(this.alertas[i].lng)
      }
      var edicao="";
      if(this.alertas[i].meu=='S'){
        edicao= "<a onclick='removerMarcador(" + this.alertas[i].id +"," + this.alertas[i].tipoalertaid +")'>Remover</a> | <a onclick='editarMarcador(" + this.alertas[i].id +"," + this.alertas[i].tipoalertaid +")'>Editar</a>";
      }

      const marker = new google.maps.Marker({
        position:{
          lat: parseFloat(this.alertas[i].lat),
          lng: parseFloat(this.alertas[i].lng)
        } ,
        map: this.map,
        title:  this.alertas[i].nome,
        //animation: google.maps.Animation.DROP, //BOUCE
        icon: {
          url: "/assets/images/" + this.alertas[i].icone,
          scaledSize: new google.maps.Size(40, 40), // scaled size
          origin: new google.maps.Point(0,0), // origin
          anchor: new google.maps.Point(0, 0) // anchor
        },
        address : this.alertas[i].mensagem,
        editar: edicao
        
      });/**/
      
      var _self = this;
      marker.addListener('click', function(){
        console.log(this);
        var contentString = '<div id="content" style="width: 200px;text-align: center;">'+
        '<img src="' + this.icon.url+ '" style="width: 30px;"><h6 id="firstHeading" class="firstHeading">' + this.title + '</h6>'+
        '<div id="bodyContent">'+
        '<p>' + this.address + '</p>'+
        '<p>' + this.editar + '</p>'+
        '</div>'+
          '</div>';
          
        var infowindow = new google.maps.InfoWindow({
          content: contentString
        });
        infowindow.open(this.map, marker);
        //_self.teste();
        //console.log("clicou");
        //alert("Mais informações sobre o alerta" );
      });

      this.markers.push(marker);
      
    }
  }
  async loadAlertas(){
    let dados = await this.service.getAlertas(this.posicaoAtual.lat,  this.posicaoAtual.lng);
    this.alertas = dados;
    
    if(this.markers){
      for (var i = 0; i < this.markers.length; i++) {
        this.markers[i].setMap(null);
      }
      this.markers=[];
    }
    var avisogps=false;
    const points = new Array<ILatLng>();
    for(let i=0; i < this.alertas.length;i++){

      if(!avisogps && this.isTracking && this.alertas[i].avisogps=="S"){
        
        try{
          this.agendarNotifiacao("Bike4All",this.alertas[i].nome + ' nas proximidades', new Date());
        } catch{}

        console.log("aviso");
        avisogps=true;
        var htmlAviso = "<div class='sinalizacao'>" +
                        "<img src='/assets/images/" + this.alertas[i].icone + "'> " + this.alertas[i].nome + "</div>";
        $(".caminhos-alertas-topo").html(htmlAviso);
        $("section.caminhos-alertas-topo").show();
        $("section.caminhos-alertas-topo").css("top","0px");
        $("section.caminhos-alertas-topo").css("height","auto");
      }

      points[i] = {
        lat: parseFloat(this.alertas[i].lat),
        lng: parseFloat(this.alertas[i].lng)
      }
      var edicao="";
      if(this.alertas[i].meu=='S'){
        edicao= "<a onclick='removerMarcador(" + this.alertas[i].id +"," + this.alertas[i].tipoalertaid +")'>Remover</a> | <a onclick='editarMarcador(" + this.alertas[i].id +"," + this.alertas[i].tipoalertaid +")'>Editar</a>";
      }

      const marker = new google.maps.Marker({
        position:{
          lat: parseFloat(this.alertas[i].lat),
          lng: parseFloat(this.alertas[i].lng)
        } ,
        map: this.map,
        title:  this.alertas[i].nome,
        //animation: google.maps.Animation.DROP, //BOUCE
        icon: {
          url: "/assets/images/" + this.alertas[i].icone,
          scaledSize: new google.maps.Size(40, 40), // scaled size
          origin: new google.maps.Point(0,0), // origin
          anchor: new google.maps.Point(0, 0) // anchor
        },
        address : this.alertas[i].mensagem,
        editar: edicao
        
      });/**/
      
      var _self = this;
      marker.addListener('click', function(){
        console.log(this);
        var contentString = '<div id="content" style="width: 200px;text-align: center;">'+
        '<img src="' + this.icon.url+ '" style="width: 30px;"><h6 id="firstHeading" class="firstHeading">' + this.title + '</h6>'+
        '<div id="bodyContent">'+
        '<p>' + this.address + '</p>'+
        '<p>' + this.editar + '</p>'+
        '</div>'+
          '</div>';
          
        var infowindow = new google.maps.InfoWindow({
          content: contentString
        });
        infowindow.open(this.map, marker);
        //_self.teste();
        //console.log("clicou");
        //alert("Mais informações sobre o alerta" );
      });

      this.markers.push(marker);
      
    }
  }
  openNotificacoes(){ 
    this.menu.open('end');
  }
  openMeuPerfil(){ 
    this.router.navigateByUrl('/home/meu-perfil');
  }

  async editarMarcador(id:any, tipo:any)
  {
    console.log("teste");
    
    const alert = await this.alertController.create({
      header: 'Comentário',
      inputs: [
        {
          name: 'nomecomentario',
          type: 'text',
          placeholder: 'Edite o comentário'
          //maxlenght:'250'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
            
          }
        },
        {
          text: 'Salvar',
          handler: async data => {
            console.log(data);
            //return false;
            var obj = { 
              id: id
              , nome: data.nomecomentario
              , tipoid: tipo
            };
            let ret = await this.service.postAny("v1/avisoatualizar", obj);
            this.loadAlertas();
            //this.fecharMapa();
          }
        }
      ]
    });
    await alert.present();
  }
  async removerMarcador(id:any, tipo:any)
  {
    let ret = await this.service.postAny("v1/avisoremover",{ id: id, tipoid: tipo });
    this.loadAlertas();
  }
  async calcRoutDif(start:any, end:any){
    //this.directionsDisplayBack.setMap(null);
    this.directionsDisplay.setMap(this.map);
    const request = {
      //Pode ser uma coordenada, uma string ou um lugar
      origin: start,
      destination: end.description,
      travelMode: 'BICYCLING'
    };
    await this.tracarRota(this.directionsDisplayBack, request);
    //console.log("recentralizar;");
    //this.recentralizar();

  }
  async tracarRota(display:any, request:any)
  {
    var este = this;

    var rota;
    await this.directionsService.route(request, async function(result,status){

      console.log(result);

      if(status=='OK'){
        display.setDirections(result);
        
        este.rotas = result.routes;
        console.log(result.routes);
        
        if(result.routes.length>0){
          rota = result.routes[0];
          if(rota.legs.length>0){
            this.destinoMapa = { titulo: rota.summary,
              endereco: rota.legs[0].end_address,
              distancia: rota.legs[0].distance,
              tempo: rota.legs[0].duration,
              instrucao: rota.legs[0].steps[0].instructions,
            };
          }
        }
        console.log(este.rotas);
        
        $(".caminhos-alertas-topo p").html(this.destinoMapa.instrucao);
        //este.distanciaTotal = this.destinoMapa.distancia.text;
        este.distanciaTotalTempo = this.destinoMapa.distancia.text;
        este.tempoTotalTexto =  this.destinoMapa.tempo.text; 
        document.getElementById("gpsDistanciaTempo").innerHTML = this.destinoMapa.distancia.text; // + " • 17:49";
        /**/
      } 
      else if (status=="NOT_FOUND"){
        //this.aviso('Erro no destino','Não conseguimos encontrar rota para o destino informado.');  
      }
      else { console.log(status);}
    });
    
  }

  async calcRoute(item:any){
    this.search="";
    this.destination=item;
    //const info: any = await Geocoder.geocode({address:this.destination.description});
    if(this.markers){
      for (var i = 0; i < this.markers.length; i++) {
        this.markers[i].setMap(null);
      }
    }

    this.marcador.setIcon(this.cursor3);
    this.marcador.setMap(null);

    var bikeLayer = new google.maps.BicyclingLayer();
    bikeLayer.setMap(this.map);


    console.log(this.destination)
    console.log(this.posicaoAtual);

    this.directionsDisplay.setMap(this.map);
    const request = {
      //Pode ser uma coordenada, uma string ou um lugar
      origin: this.posicaoAtual,
      destination: this.destination.description,
      travelMode: 'BICYCLING'
    };
    this.traceRoute(this.directionsDisplay, request);
    
    $("#sugestaoRota .top #imgFavoritar").show();
    $("#sugestaoRota .top #imgFavoritarAtivo").hide();
  }
  async traceRoute(display:any, request:any)
  {
    console.log("entrou na Route");
    var este = this;
    var rota;
     await this.directionsService.route(request, async function(result,status){
        console.log(result);
        if(status=='OK'){
          
          var maior=0;
          var menor=0;
          var atual=0;

          display.setDirections(result);       
          este.rotas = result.routes;          
          if(result.routes.length>0){
            rota = result.routes[0];
            if(rota.legs.length>0){
              este.destinoMapa = { titulo: rota.summary,
                endereco: rota.legs[0].end_address,
                distancia: rota.legs[0].distance,
                tempo: rota.legs[0].duration,
                instrucao: rota.legs[0].steps[0].instructions,
              };
              var location=[];
              var kilometros=[];
              var labels=[];
              var elevacao=[];
              var steps = rota.legs[0].steps;
              var distancia=0.00;

              location.push({lat: steps[0].start_location.lat(),lng: steps[0].start_location.lng()});

              for (var i = 0; i < steps.length; i++) {
                distancia += steps[i].distance.value;
                labels.push((distancia/1000).toFixed(2) + "km"); //steps[i].distance.text);
                kilometros.push(steps[i].distance.value);
                location.push({lat: steps[i].end_location.lat(),lng: steps[i].end_location.lng()});
              }
              
              var elevator = new google.maps.ElevationService;
              await elevator.getElevationForLocations({'locations': location}, async function(results, status) {
                if (status === 'OK') {
                  console.log(results);
                  
                  if(results.length>0){
                      
                    this.posicaoDestino = {
                                            lat: results[results.length-1].location.lat(), 
                                            lng: results[results.length-1].location.lng()
                                          };
                    console.log(this.posicaoDestino);    
                  }

                  for (var i = 0; i < results.length; i++) {
                    if(i==0){
                      atual = results[i].elevation;
                    }
                    if(results[i].elevation > maior || maior==0)
                      maior= results[i].elevation;
                      
                    if(results[i].elevation < menor || menor==0)
                      menor= results[i].elevation;
                    
                    elevacao.push(results[i].elevation);
                  }
                  
                  este.destinoMapa.maiorElevacao=(maior-atual).toFixed(0)+"m";
                  este.destinoMapa.menorElevacao=(atual-menor).toFixed(0)+"m";
                  este.loadGrafico(labels,kilometros,elevacao);
                } else {
                  console.log('Elevation service failed due to: ' + status);
                }
              });
            }
          }
          console.log(este.rotas);
          
          $(".caminhos-alertas-topo p").html(este.destinoMapa.instrucao);

          document.getElementById("nomeSugestao").innerHTML = este.destinoMapa.titulo; 
          document.getElementById("enderecoSugestao").innerHTML = este.destinoMapa.endereco; 
          document.getElementById("timeEnderecoSugestao").innerHTML = este.destinoMapa.tempo.text; 
          document.getElementById("distanciaEnderecoSugestao").innerHTML = este.destinoMapa.distancia.text; 
          este.tempoTotalTexto =  este.destinoMapa.tempo.text; 
          document.getElementById("gpsDistanciaTempo").innerHTML = este.destinoMapa.distancia.text; // + " • 17:49";
          
          $("#sugestaoRota .top").show();
          $("#sugestaoRota .conteudo-middle").show();
          $("#sugestaoRota").css("bottom","0px");
                
          $("#sugestaoRota").css("min-height","30%");
          $("#btnGravar").css("bottom","-90px");
          $("footer").css("bottom","-90px");
        } 
        else if (status=="NOT_FOUND" || status=="ZERO_RESULTS"){
          if(request.travelMode=='BICYCLING'){
            console.log("trocando para DRIVING");
            request.travelMode='DRIVING';
            await este.traceRoute(display,request);
          }
          else{
            este.cancelarSugestao();
            alert('Não conseguimos encontrar rota para o destino informado.');  
          }
          //this.aviso('Erro no destino','Não conseguimos encontrar rota para o destino informado.');  
        }
        else { 
          if(request.travelMode=='BICYCLING'){
            console.log("trocando para DRIVING");
            request.travelMode='DRIVING';
            await este.traceRoute(display,request);
          }
          else{
            este.cancelarSugestao();
            alert('Não conseguimos encontrar rota para o destino informado.');  
          }
          
        }
      });
    
  }

  loadGrafico(labels:any, valores1:any, valores2:any){

    var canvas:any = document.getElementById('graficoElevacao');
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
            }
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
  async limpar(){
    try{
      $("#autoPause").hide();
      console.log("LIMPANDO MAPA")
        
      for (var i = 0; i < this.markers.length; i++) {
        this.markers[i].setMap(null);
      }

      this.path=[]; 
      this.trackedRoute=[];
      if(this.polyline ){
        for (var i = 0; i < this.polyline.length; i++) {
          this.polyline[i].setMap(null);
        }
        this.polyline.setMap(null);
      }
      this.polyline = null;
      this.marcadorAccuracy.setMap(null);
      this.marcadorAccuracy = null;
      this.map.setZoom(18);  
      this.map.setCenter(this.posicaoAtual);  
      
      //this.marcador.setMap(null);
      
      this.directionsDisplay.setMap(null);
      this.recentralizar();
      
      
      console.log("alertas");
      this.loadAlertas();
      this.stoptBackgroundGeolocation();
    }
    catch(error){
      console.log(error);
    }
    finally{}
  }
  
  async cancelarRota(){
    
    this.destination = null;
    this.isTracking=false;
    this.isMoving=false;
    this.gerarCustom=true;
    clearInterval(this.interval);
    this.stoptBackgroundGeolocation();
    this.fecharMapa();    
    this.marcador.setIcon(this.cursor);  
  }
  searchChanged(){
    var options = {
      componentRestrictions: {country: 'br'}
    };
    
    if(!this.search.trim().length) return;
    //this.googleAutocomplete.getPlacePredictions({input: this.search, componentRestrictions: { country:["br","hu"]}}, predictions => {
    this.googleAutocomplete.getPlacePredictions({input: this.search}, predictions => {
    
      this.ngZone.run(()=>{
        this.searchResults = predictions;
      });
    });
  }
  verMapa(){
    console.log(document.getElementById("sugestaoRota").style.minHeight);
    if(document.getElementById("sugestaoRota").style.minHeight=="30%"){
      $("#sugestaoRota .top").hide();
      $("#sugestaoRota .conteudo-middle").hide();
      $("#sugestaoRota").css("min-height","auto");
    }
    else{
      $("#sugestaoRota .top").show();
      $("#sugestaoRota .conteudo-middle").show();
      $("#sugestaoRota").css("bottom","0px");
      $("#sugestaoRota").css("min-height","30%");
    }
  }
  verRotas(){
    $("#sugestaoRota .top").hide();
    $("#sugestaoRota .conteudo-middle").hide();
  }

  async iniciaGravacao(){


    try{
      this.agendarNotifiacao("Bike4All","Você começou uma gravação.", new Date());
    } catch{}

    this.destination = null;
    this.originPosition = this.posicaoAtual;
    this.isGravando = true;
    this.contTempo=0;

    var obj = { lat: this.posicaoAtual.lat, lng: this.posicaoAtual.lng, destino:'', distancia:0, tempo:0, velocidademedia:0, idtrajeto:''};
    //this.service.iniciarGravacao(obj);
    let ret = await this.service.iniciarGravacao(obj);
    this.idtrajeto= ret.idtrajeto;
    console.log("INICIOU GRAVACAO");
    console.log(this.idtrajeto);

    $("#btnGravar").css("bottom","-90px");
    $("footer").css("bottom","-90px");
    this.destinoMapa = { titulo:"", endereco:"", tempo:{text: "0 min", value:0}, distancia:{text:"1km distancia",value:1},instrucao:''  };
    
    document.getElementById("nomeSugestao").innerHTML =  "";
    document.getElementById("enderecoSugestao").innerHTML =  "";
    document.getElementById("timeEnderecoSugestao").innerHTML =  "";
    document.getElementById("distanciaEnderecoSugestao").innerHTML =  "";
    
    this.tempoTotalTexto =  "0 min";
    //document.getElementById("gpsVelocidadeMedia").innerHTML = "0 <u>km/h</u>";
    //document.getElementById("gpsDistancia").innerHTML = "0 <u>km</u>"; //this.destinoMapa.distancia.text; + " <u>km</u>";
    document.getElementById("gpsDistanciaTempo").innerHTML =  " ";

    this.iniciarTracking();


  }
  async iniciaPercurso(passeioid:any, rotaid:any, destinofavoritoid:any,trajetosalvoid:any){
    this.originPosition = this.posicaoAtual;
    this.isGravando = false;
    this.contTempo=0;
    //this.tempoTotalTexto =  "0 min";
    var obj = { lat: this.posicaoAtual.lat, 
              lng: this.posicaoAtual.lng, destino:'', distancia:0, tempo:0, velocidademedia:0, idtrajeto:'',
              passeioid: passeioid, 
              rotaid: rotaid, 
              destinofavoritoid: destinofavoritoid,
              trajetosalvoid: trajetosalvoid};
    let ret = await this.service.iniciarPercurso(obj);
    this.idtrajeto= ret.idtrajeto;
    console.log("iniciou trajeto");
    console.log(this.idtrajeto);
    this.iniciarTracking();
  }
  

  iniciarTracking(){
    this.isTracking=true;
    this.recentralizar();
    this.startTracking();
    
    setTimeout("fecharSugestao()",1000);    
    console.log("INICIANDO TRACKING DO PERCURSO","background:#ff0000;color:#fff;");    


    if(this.isGravando)
    {
      $("section.caminhos-alertas-topo").hide();
      $(".caminhos-alertas-topo").html("");
      $("section.caminhos-alertas-topo").show();
      $("section.caminhos-alertas-topo").css("top","0px");
      $("section.caminhos-alertas-topo").css("height","auto");
    }else
    {
      $("section.caminhos-alertas-topo").show();
      $("section.caminhos-alertas-topo").css("top","0px");
      $("section.caminhos-alertas-topo").css("height","auto");
    }
    $(".toolbar-flutuante").fadeIn("500");
    $(".sinalizacao").hide();
    
    this.tempo=0;
    this.startTimer();

    //Chamar navegador GPS google
    if(!this.isGravando){
      
      console.log(this.destination.description);


      //Modelo somente google
      
      let options: LaunchNavigatorOptions = {
        app: this.launchNavigator.APP.GOOGLE_MAPS,
        transportMode: this.launchNavigator.TRANSPORT_MODE.BICYCLING
      };

      
      this.launchNavigator.navigate(this.destination.description,options).then(
        success => console.log('Launched navigator'),
        error => {console.log('Error launching navigator');  }
      );
      

    }
  }
  
  
  startTracking(){
    this.loadAlertasTracking();

    console.log("INICIANDO TRACK");
    
    this.marcador.setMap(null);
    this.marcador = new google.maps.Marker({
      position:this.posicaoAtual ,
      map: this.map,
      title: 'Minha posição',
      animation: google.maps.Animation.DROP, //BOUCE
      icon: this.cursor3
    });

    this.geolocation.getCurrentPosition({enableHighAccuracy:true}).then((resp)=>{
      this.posicaoAtual = {lat: parseFloat(resp.coords.latitude.toString()), lng: parseFloat(resp.coords.longitude.toString())};
      var obj = { lat: parseFloat(this.posicaoAtual.lat.toString()), lng: parseFloat(this.posicaoAtual.lng.toString())};
      this.marcador.setPosition(obj);
    }).catch((error)=>{
      console.log("sem GPS");
      //this.aviso("GPS","Sinal de GPS fora do ar.");
    });


    this.isTracking=true;
    this.isMoving=true;
    this.trackedRoute=[];
    this.path=[];
    
    this.startBackgroundGeolocation();
    
 
    //this.positionSubscription = this.geolocation.watchPosition({enableHighAccuracy:true})
    this.positionSubscription = this.geolocation.watchPosition({enableHighAccuracy:true})
      //.filter((p) => p.coords !== undefined)
      .subscribe(data=>{
        
        setTimeout(()=>{
          if ("coords" in data) {
            // proceed as before
            
            console.log(this.destination);

            if (data.coords.speed == undefined) {
              data.coords.speed = 0;
            }
            let timestamp = new Date(data.timestamp);   

            if(data.coords!=undefined && this.isTracking)
            {
              
              this.posicaoAnterior=this.posicaoAtual;            
              this.posicaoAtual = {lat: parseFloat(data.coords.latitude.toString()), lng: parseFloat(data.coords.longitude.toString())};
                             
              this.tempoUltima +=1;
              
              var from = new google.maps.LatLng(this.posicaoAnterior.lat, this.posicaoAnterior.lng);
              var to = new google.maps.LatLng(parseFloat(data.coords.latitude.toString()), parseFloat(data.coords.longitude.toString()));
        
              this.marcador.setPosition(this.posicaoAtual);     

              var dist = google.maps.geometry.spherical.computeDistanceBetween(from, to);
                 
              console.log(dist);
              
              //this.ultimoTempo = new Date();

              if(dist > 0.2){
                this.ultimoTempo = new Date();
              }
              if(dist>=500){
                return;
              }

              var km = (dist/1000).toFixed(1); 
              var altitude = Number.isNaN(data.coords.altitude) ? 0 : data.coords.altitude;
              var bearing = Number.isNaN(data.coords.heading ) ? 0 : data.coords.heading;
              this.velocidade = (Number.isNaN(data.coords.speed * 3.6) ? 0 : (data.coords.speed * 3.6)).toFixed(0);
              this.distancia = km;
              this.distanciaTotal += (dist/1000);
              //this.velocidadeMedia = this.distanciaTotal / (this.tempo/3600);
              
              
              if(this.isGravando){
                document.getElementById("gpsDistanciaTempo").innerHTML = this.distanciaTotal.toFixed(1) + " <u>km</u>"; 
              } else {
                //this.calcRoutDif(to, this.destination);
                //this.recentralizar();
              }
              //this.velocidade = data.coords.speed;
              this.path.push(to); 
              this.trackedRoute.push({lat:parseFloat(data.coords.latitude.toString()), lng: parseFloat(data.coords.longitude.toString())});
        
              
              
              var obj = { lat: this.posicaoAtual.lat
                , lng: this.posicaoAtual.lng
                , destino:''
                , distancia:(dist/1000)
                , tempo:this.tempo
                , elevacao:altitude
                , velocidademedia:this.velocidadeMedia
                , idtrajeto:this.idtrajeto
                , gravacao: (this.isGravando ? "sim" :"não")
                , horario: timestamp
              };  
              this.service.dadosPercurso(obj);
        
              this.service.post("teste", {modulo:'gps dados LOCAL', texto:JSON.stringify(obj)} );
              
              //var center = new google.maps.LatLng( data.coords.latitude, data.coords.longitude);  
              //console.log(center);
              //this.marcador.setIcon(this.cursor3);      
        
              var latLngBounds = new google.maps.LatLngBounds();
              for(var i = 0; i < this.path.length; i++) {
                latLngBounds.extend(this.path[i]);
              }
              
              //this.service.post("teste", {modulo:'gps', texto:'vai pintar'} );
              
            
              // DESENHAR
              if(this.polyline)
                this.polyline.setMap(null);
        
              this.polyline = new google.maps.Polyline({
                map: this.map,
                path: this.path,
                strokeColor: '#F9D699',
                strokeOpacity: 1,
                strokeWeight: 7
              });
        
        
              try{
                this.loadAlertasTracking();

                if(this.isMoving) {                 
                  this.map.setZoom(18);  
                  this.map.setCenter(to); 
                  //this.recentralizar(); 
                }
         
                let cameraPosition: CameraPosition = this.map.getCameraPosition();
                cameraPosition.bearing = 90; // heading of the map

                this.map.animateCamera(bearing);

                this.marcadorAccuracy.setPosition(this.posicaoAtual);
                this.marcadorAccuracy.setRadius(data.coords.accuracy);
              }catch{}
              
        
              if(!this.isGravando){
                //this.directionsDisplay.setMap(this.map);
              } else {
                //this.directionsDisplay.setMap(this.map);
                //this.recentralizar(); 
              }

            }
          } else {
            // ruh roh we have a PositionError
          }
        })
      });
      /**/
  }
  
  async recentralizar(){
    
    this.geolocation.getCurrentPosition({enableHighAccuracy:true}).then((resp)=>{
      this.posicaoAtual = {lat: parseFloat(resp.coords.latitude.toString()), lng: parseFloat(resp.coords.longitude.toString())};
      
      var obj = { lat: parseFloat(this.posicaoAtual.lat.toString()), lng: parseFloat(this.posicaoAtual.lng.toString())};
      
      console.log(obj);
      
      this.marcador.setPosition(obj);
      this.marcador.setIcon(this.cursor3);  
      
      this.map.setZoom(18);  
      this.map.setCenter(obj);  
      this.isMoving=true;
      
    }).catch((error)=>{
      console.log("sem GPS");
      //this.aviso("GPS","Sinal de GPS fora do ar.");
    });
     
  }
  
  startTimer() {
    $("#autoPause").hide();
    this.isTracking=true;
    this.isMoving=true;

    this.lastTime = new Date();
    this.ultimoTempo = new Date();

    this.interval = setInterval(() => {
      if(this.isTracking){
        //this.contTempo++;
        
        var dt2 =  new Date();
        var dt1 = this.lastTime;

        var dt3 = this.ultimoTempo;
        var diffPause =(dt2.getTime() - dt3.getTime()) / 1000;

        console.log(this.ultimoTempo);
        console.log(diffPause);
        //console.log(dt2);
        //console.log(dt1);

        var diff =(dt2.getTime() - dt1.getTime()) / 1000;
        //diff /= 60;
        var segundosTime = Math.abs(Math.round(diff));
        //console.log(diff);
        //console.log(segundosTime);
        this.contTempo = segundosTime + this.tempo;
        //console.log(this.contTempo);

        //console.log("Timer" + this.contTempo);

        var totalSeconds = parseFloat(this.contTempo); // don't forget the second param
        var hours   = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        var minutes = Math.floor(totalSeconds / 60);
        var seconds = totalSeconds % 60;

        /*var minutes = Math.floor((totalSeconds - ((hours * 3600)) / 60));
        var minutes = Math.floor(((totalSeconds / 60) - ((hours * 3600)) / 60));
        var seconds = Math.floor((totalSeconds - ((hours * 3600)) / 60)); //Math.floor((mins_num * 60) - (hours * 3600) - (minutes * 60));
        */
        var horas="";
        var minutos="";
        var segundos="";
        // Appends 0 when unit is less than 10

        if (hours   < 10) { horas   = "0"+hours; } else { horas = hours.toString(); }
        if (minutes < 10) { minutos = "0"+minutes; } else { minutos = minutes.toString(); }
        if (seconds < 10) { segundos = "0"+seconds; } else { segundos = seconds.toString(); }
        
        if(this.isGravando){
          if(hours > 0)
            this.tempoTotalTexto = hours.toString() + "h" + (minutes > 0 ? minutos + " min" : "");
          else if(minutes > 0)
            this.tempoTotalTexto = hours.toString() + "h" + minutes.toString() + " min";
          else
            this.tempoTotalTexto = seconds.toString() + " seg";
        }
        else{
          
          /*if(hours > 0)
            this.tempoTotalTexto = hours.toString() + "h" + (minutes > 0 ? minutos + " min" : "");
          else if(minutes > 0)
            this.tempoTotalTexto = hours.toString() + "h" + minutes.toString() + " min";
          else
            this.tempoTotalTexto = seconds.toString() + " seg";
          */
          //this.tempoTotalTexto =  tempo;

        }
        var tempo = horas+':'+minutos+':'+segundos;
        this.tempoTexto = tempo;
        
        if(Math.abs(Math.round(diffPause)) >= 10 && this.isGravando){
          this.autoPause();
        }
        
    }
      //document.getElementById("gpsTempoHoras").innerHTML = tempo; 
    },1000);
  }
    
  pausar() { //you can use this function if you want restart timer
    if($("#btnPausar").html()=="PAUSAR"){
      console.log("PAUSANDO TIMER");  
      $("#btnPausar").html("RETOMAR");
      
      this.isTracking=false;
      this.isMoving=false;
      
      var dt2 =  new Date();
      var dt1 = this.lastTime;

      var diff =(dt2.getTime() - dt1.getTime()) / 1000;
      //diff /= 60;
      var segundosTime = Math.abs(Math.round(diff));
      this.tempo = this.tempo + segundosTime;

      clearInterval(this.interval);

    } else{
      console.log("REINICIANDO TIMER");  
      $("#btnPausar").html("PAUSAR");
      this.lastTime = new Date();
      this.startTimer();
    }
    
  }
  autoPause() { //you can use this function if you want restart timer
    
    console.log("AUTO PAUSANDO TIMER");  
    $("#btnPausar").html("RETOMAR");
    $("#autoPause").show();
    
    
    $("#gpsFooter").css("bottom","0px");
    $(".velocidade").css("bottom","250px");
    $(".recentralizar").css("bottom","250px");
    
    this.isTracking=false;
    this.isMoving=false;
    
    var dt2 =  new Date();
    var dt1 = this.lastTime;

    var diff =(dt2.getTime() - dt1.getTime()) / 1000;
    //diff /= 60;
    var segundosTime = Math.abs(Math.round(diff));
    this.tempo = this.tempo + segundosTime;

    clearInterval(this.interval);

    
  }
  

  async compartilhar() { //you can use this function if you want restart timer  
    
    this.destination = null;
    this.loading = await this.loadingCtrl.create({message:'Carregando...'});
    await this.loading.present();

    try {
      
      await this.service.post("teste", {modulo:'gustavo', texto:"iniciou compartilhar"} );
      //await this.service.post("teste", {modulo:'debug', texto: "INICIANDO FUNÇÃO PARA COMPARTILHAR POSTAGEM"} );

      if($("#btnPausar").html()=="PAUSAR"){
        console.log("PAUSANDO TIMER");  
        $("#btnPausar").html("RETOMAR");
        
        this.isTracking=false;
        this.isMoving=false;
        clearInterval(this.interval);
  
      } 
      $("#btnPausar").html("RETOMAR");
      this.tempo=0;
      clearInterval(this.interval);

      this.isTracking=false;
      this.isMoving=false;
      this.gerarCustom=true;
      this.stoptBackgroundGeolocation();

      /*
      var key="aJKcOR7YkK5cuqQrOqeRlECeuzkYKa8i"; //"AIzaSyA3kg7YWugGl1lTXmAmaBGPNhDW9pEh5bo";
      
      var url="https://www.mapquestapi.com/staticmap/v5/map";
      url += "?key=" + key;
      url += "&size=350,300";
      url += "&type=map";
      url += "&zoom=15";
      url += "&imagetype=png";*/
      
      await this.service.post("teste", {modulo:'gustavo', texto:"vai iniciar dados do mapa"} );
      
      var key="AIzaSyA5GQ6wb3-gCoPAjzD2iXhaIRzhVl_H4Cc";
      var url="https://maps.google.com/maps/api/staticmap?sensor=false";
      //url += "&center=" + this.posicaoAtual.lat.toFixed(7) + "," + this.posicaoAtual.lng.toFixed(7) + "";
      //url += "&zoom=15";
      url += "&size=512x512&format=jpg";
      //url += "&markers=" + this.posicaoAtual.lat.toFixed(7) + "," + this.posicaoAtual.lng.toFixed(7) + "";

      await this.service.post("teste", {modulo:'gustavo', texto:"rotas:" + JSON.stringify(this.trackedRoute)} );
      
      var posicoes="";
      if(this.trackedRoute.length>0){
        
        await this.service.post("teste", {modulo:'gustavo', texto:"rotas maior que zero"});
        try{
          var waypts=[];

          for (var i = 1; i < this.trackedRoute.length-1; i++) {
              waypts.push({
                location: this.trackedRoute[i],
                stopover: true
              });
          }

          const request = {
            origin: this.trackedRoute[0],
            waypoints: waypts,
            destination: this.trackedRoute[this.trackedRoute.length-1],
            travelMode: 'BICYCLING'
          };

          console.log(request);
          await this.tracarRota(this.directionsDisplay, request);

          console.log(this.rotas);
          
          await this.service.post("teste", {modulo:'compartilhar4', texto: "posicoes"} );
          for(var i=0;i < this.trackedRoute.length;i++){
            try{
              if(posicoes!="") posicoes+="|";
              posicoes += this.trackedRoute[i].lat.toFixed(7) + "," + this.trackedRoute[i].lng.toFixed(7);

            } catch{
              await this.service.post("teste", {modulo:'gustavo', texto:"deu erro no for das rotas1" });
            }
          }
          if(this.trackedRoute.length==1) posicoes +="|" + posicoes;
        } catch{
          
          await this.service.post("teste", {modulo:'gustavo', texto:"deu erro no for das rotas2" });
        }
      } else{
        
        await this.service.post("teste", {modulo:'gustavo', texto:"rotas menor que zero"} );
        try{
          posicoes=this.posicaoAtual.lat + "," + this.posicaoAtual.lng;
          posicoes +="|" + posicoes;
        } catch{
          await this.service.post("teste", {modulo:'gustavo', texto:"deu erro no for das rotas3" });}
      }

      url += "&path=color:0x0000ff|weight:5|" + posicoes;
      url += "&key=" + key;
      this.fotoMapaUrl=url;  
      
      await this.service.post("teste", {modulo:'gustavo', texto:"vai renderizar url:" + url });
      //this.fotoMapaUrl=this.renderPictureAsBase64(url);    
      
      await this.service.post("teste", {modulo:'gustavo', texto:"vai converter o canvas" });

      let imagem = await this.service.getImage(url+"&trajetoid=" + this.idtrajeto);
      console.log(imagem);
      this.fotoMapaUrl=imagem.imagem;
      
      var obj = { id:this.idtrajeto , urlimagem: url };
      let ret2 = await this.service.post("updateurl",obj);

    /*
      await this.convertToDataURLviaCanvas(url, "image/jpeg").then(
        base64 => { 
          console.log(base64);
          
          this.service.post("teste", {modulo:'gustavo', texto:"passou dentro do convert" });
          this.fotoMapaUrl= base64.toString();
        }
      );*/
        /*
      await this.getBase64ImageFromURL(url).subscribe(base64data => {
        //console.log(base64data);
        this.fotoMapaUrl = 'data:image/jpg;base64,'+base64data;
        //console.log(this.base64Image);
      });*/
      
      await this.service.post("teste", {modulo:'gustavo', texto:"fez a conversao da foto: " + this.fotoMapaUrl });
      console.log(this.fotoMapaUrl);
      
      var imagemFundo = this.fotoMapaUrl;
      $(".area-criacao").css("background","url('"+imagemFundo+"') #f2f2f2 no-repeat");
      $(".area-criacao").css("background-size","cover");
      $(".area-criacao").css("background-position","center center");
      
      $("#imgFoto").attr("src",imagemFundo);
      
      $("#imagem1").css("background","url('"+imagemFundo+"') #f2f2f2 no-repeat");
      $("#imagem1 a").attr("data-url",""+imagemFundo+"");

      await this.service.post("teste", {modulo:'gustavo', texto:"vai renderezirar mais uma vez" });
      /*this.fotoMapaUrl=this.renderPictureAsBase64(url);
      console.log(this.fotoMapaUrl);
      await this.service.post("teste", {modulo:'gustavo', texto:"renderizou pela segunda vez" });
*/
      //await this.gerarImagem();
      $("section.compartilhar-conteudo").css("bottom","0px");
    } 
    catch{
      
      await this.service.post("teste", {modulo:'gustavo', texto:"deu erro no for das rotas4" });
      $("section.compartilhar-conteudo").css("bottom","0px");
    }
    finally{
      this.loading.dismiss();
    }
  }
  async cancelarCompartilhamento(){
    //await this.gerarImagem();
    this.gerarCustom=false;
    this.fecharMapa();
    this.idtrajeto=0;
    $("section.compartilhar-conteudo").css("bottom","-1000px");
  }
  async finalizarCompartilhamento(){
    this.loading = await this.loadingCtrl.create({message:'Carregando...'});
    await this.loading.present();

    await this.service.post("teste", {modulo:'gustavo', texto:"finalizando comp1" });
    this.gerarCustom=false;
    //await this.normalShare();
    //this.gerarImagem();
    this.idtrajeto=0;

    await this.gerarImagem();
    await this.service.post("teste", {modulo:'gustavo', texto:"finalizando comp2" });
    this.fecharMapa();
    await this.service.post("teste", {modulo:'gustavo', texto:"finalizando comp3" });

    await this.normalShare();
    await this.service.post("teste", {modulo:'gustavo', texto:"finalizando comp4" });
    
    $("section.compartilhar-conteudo").css("bottom","-1000px");
  }
  async normalShare() {
    //await this.service.post("teste", {modulo:'compartilharShare', texto:this.fotoUrl });
    //this.socialSharing.share("Compartilhando por Bike4All.", null, this.fotoUrl, null);
    //await this.service.post("teste", {modulo:'compartilharShare2', texto:"base64"});
    await this.service.post("teste", {modulo:'gustavo', texto:"abrindo compartilhador" });
    this.socialSharing.share("Compartilhando por Bike4All.", null, this.base64Image, null);
  }
  
  /*FUNCOES PARA IMAGEM */
  async gerarImagem(){
    
    try {
      await this.service.post("teste", {modulo:'gustavo', texto:"gerando imagem" });
      const element = document.getElementById('html2canvas');
      const targetElement = document.getElementById('areaCriacaoCompartilhamento').cloneNode(true);
      element.appendChild(targetElement);

      console.log(element);
      await this.ioniccanvas(element.firstChild).then(async (img) => {
          this.base64Image= img;
          element.firstChild.remove();
          await this.uploadImage();
      }).catch((res) => {
          console.log(res);
          this.service.post("teste", {modulo:'gerarimagem', texto: "deu erro 1527"} );
          this.service.post("teste", {modulo:'gerarimagem', texto: "deu erro" + JSON.stringify(res)} );
      });
      console.log(this.img);
    } catch{
      this.service.post("teste", {modulo:'compartilhar8', texto: "deu erro"} );}
  }

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
          
      var imagemFundo = "data:image/jpeg;base64," + imageData;
      $(".area-criacao").css("background","url('"+imagemFundo+"') #f2f2f2 no-repeat");
      $(".area-criacao").css("background-size","cover");
      $(".area-criacao").css("background-position","center center");
      //this.uploadImage();
    });
 
  }
  async uploadImage(){
        
    try{
      await this.service.post("teste", {modulo:'gustavo', texto:"upload imagem" });
      let ret = await this.service.postAny("v1/upload?var=postAny",{ image: this.base64Image });
      this.fotoUrl = ret.image_url;
      var obj = { id:this.idtrajeto , urlimagem: this.fotoUrl };
      let ret2 = await this.service.post("updateurl",obj);
  
    }catch{

    }
    finally{
      this.loading.dismiss();
    }

    
  }
  renderPictureAsBase64(image) {
    return 'data:image/jpeg;base64,' + btoa(unescape(encodeURIComponent(image)))
  }

  /*FIM FUNCOES PARA IMAGEM*/
  public ioniccanvas(ele) {

    if (!ele) {
        return;
    }
    console.log(ele);

    const option = {allowTaint: true, useCORS: false};
    return html2canvas(ele, option).then((canvas) => {
        if (canvas) {
            return canvas.toDataURL('image/png');
        }
        return null;
    }).catch((res) => {
        console.log(res);
        return res;
    });
   
  }
  async cancelarSugestao()
  {
    this.destination=null;
    await this.limpar();
    
    console.log(this.posicaoAtual);

    console.log("CANCELANDO PERCURSO");  
    this.destinationPosition="";
    this.tempo=0;
    
    $("#autoPause").hide();
    clearInterval(this.interval);
    //this.contTempo=0;
    $(".conteudo-inner-full").fadeIn(500);
    $("section.caminhos-alertas-topo").css("top","-500px");
    $(".toolbar-flutuante").fadeOut("500");
    $(".recentralizar").fadeOut("500");
    $(".velocidade").fadeOut("500");
    $("#sugestaoRota").css("bottom","-200%");
    $("#gpsFooter").css("bottom","-200%");

    setTimeout("cancelarSugestao()",1000);    
    setTimeout("openMenus()",1000);
    
    this.directionsDisplay.setMap(null);
    this.destination=null;
    //this.recentralizar();
  
  }
  async concluir() { 
    
    $("#autoPause").hide();
    if($("#btnPausar").html()=="PAUSAR"){
      console.log("PAUSANDO TIMER");  
      $("#btnPausar").html("RETOMAR");
      
      this.isTracking=false;
      this.isMoving=false;
      
      var dt2 =  new Date();
      var dt1 = this.lastTime;

      var diff =(dt2.getTime() - dt1.getTime()) / 1000;
      //diff /= 60;
      var segundosTime = Math.abs(Math.round(diff));
      this.tempo = this.tempo + segundosTime;

      clearInterval(this.interval);

    } 

    if(this.isGravando){
      var self = this;

      const alertDialog = await this.alertController.create({
        header: 'Nome da gravação',
        inputs: [
          {
            name: 'nomerota',
            type: 'text',
            placeholder: 'Informe o nome da gravação'
            //maxlenght:'250'
          }
        ],
        buttons: [
          {
            text: 'Voltar',
            role: 'cancel',
            handler: data => {
              console.log('Cancel clicked');
                        
              if($("#btnPausar").html()!="PAUSAR"){
                console.log("REINICIANDO TIMER");  
                $("#btnPausar").html("PAUSAR");
                this.lastTime = new Date();
                this.startTimer();
              }
            }
          },
          {
            text: 'Descartar rota',
            handler: async data => {
              console.log('Descartar clicked');
                        
              var obj = { gravacao: "sim" , idtrajeto:self.idtrajeto };
              await self.service.removerPercurso(obj);
              this.tempo=0;
              clearInterval(this.interval);
        
              this.isTracking=false;
              this.isMoving=false;
              this.gerarCustom=true;
              this.stoptBackgroundGeolocation();
        
              this.fecharMapa();
              this.recentralizar();
            }
          },
          {
            text: 'Salvar Rota',
            handler: async datarota => {
              //console.log(data);
              //return false;
              
              try{
                //alert("foi2");
                var obj = { gravacao: "sim" , nome: datarota.nomerota, idtrajeto:self.idtrajeto, tempo: this.contTempo };
                await self.service.finalizarPercurso(obj);
                await self.compartilhar();

              }catch{
                await self.service.post("teste", {modulo:'debug', texto: "erro ao finalizar percurso"} );
              }
              //this.fecharMapa();
            }
          }
        ]
      });
      await alertDialog.present();
    }
    else {
    
      var obj = { lat: this.posicaoAtual.lat
        , lng: this.posicaoAtual.lng
        , destino:''
        , distancia:this.distanciaTotal
        , tempo:this.tempo
        , velocidademedia:this.distanciaTotal / (this.tempo/3600)
        , idtrajeto:this.idtrajeto
      };  
      
      this.service.finalizarPercurso(obj);
      //this.fecharMapa();
      await this.compartilhar();
    }
    //this.recentralizar();
  }
  async fecharMapa(){
      $("section.compartilhar-conteudo").css("bottom","-1000px");
      //this.contTempo=0;
      $(".conteudo-inner-full").fadeIn(500);
      $("section.caminhos-alertas-topo").css("top","-500px");
      $(".toolbar-flutuante").fadeOut("500");
      $(".recentralizar").fadeOut("500");
      $(".velocidade").fadeOut("500");
      $("#sugestaoRota").css("bottom","-200%");
      $("#gpsFooter").css("bottom","-200%");
      $(".velocidade").css("bottom","114px");
      $(".recentralizar").css("bottom","114px");

      setTimeout("cancelarSugestao()",1000);    
      setTimeout("openMenus()",1000);
      
      this.velocidadeMedia = 0;
      
      
      this.distanciaTotal=0;
      this.tempo=0;
      this.destinationPosition="";
      this.isTracking=false;
      
      
      await this.limpar();
      this.positionSubscription.unsubscribe();
      this.tempo=0;
      clearInterval(this.interval);
      this.directionsDisplay.setMap(null);
      this.destination=null;
  }

  async showAlertaRoubo(){

    var obj = {};
    const myModal = await this.modal.create({
      component: AlertaDeRouboComponent,
      componentProps: { dados: obj },
      cssClass: 'my-custom-modal-css'
    });
    
    myModal.onDidDismiss()
      .then(async (ret) => {
        if(ret.data.data=="salvou"){
          
          let dados = await this.service.getAlertasTipo();
          this.alertasTipo = dados;
        }
    });

    return await myModal.present();
    /*
    let dados = await this.service.getBikes();
    this.bikes = dados;
    $("#marcacoesAlertaRoubo").fadeIn("500");*/
  }
  
  async gerarAlerta(item:any){

    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirmação',
      message: 'Deseja realmente registrar este alerta?',
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

            console.log(item);
            console.log(this.posicaoAtual);
            let obj = {tipoalertaid: item.id, lat: this.posicaoAtual.lat , lng: this.posicaoAtual.lng};
            let dados = await this.service.postAlerta(obj);
            console.log(dados);
            this.loadAlertas();
            $(".iniciar-marcacoes").fadeOut("500");
          }
        }
      ]
    });
    await alert.present();

  

    
  }
  aviso(titulo,mensagem){
    console.log("%c COMEÇANDO FUNÇÃO PARA EXIBIR AVISO","background:#ff0000;color:#fff;");
    $(".modal-avisos").fadeIn(100);
    $(".modal-avisos .aviso").css("bottom","0");
    // ALIMENTAR O HTML
    $(".aviso h3 span").html(titulo);
    $(".aviso p").html(mensagem+'<p style="padding-top:12px;"><button type="button" onclick="fecharAviso();" class="btn btn-primary">Ok</button></p>');
  }
  incluirMarcacao(){
     $("#marcacoesAlerta").fadeIn("500");
  }
  
  fecharIniciarMarcacoes(){
     $(".iniciar-marcacoes").fadeOut("500");
  }
  
  async marcarFavorito(){
    console.log("maracando favorito");
    this.originPosition = this.posicaoAtual;
    this.isGravando = false;
    
    console.log("montando objeto");

    console.log(this.destination);
    console.log(document.getElementById("timeEnderecoSugestao").innerHTML);
    var obj = { inicio: '' +this.posicaoAtual.lat + ','  + this.posicaoAtual.lng
              , nome:this.destinoMapa.titulo
              , endereco:this.destination.description
              , destino:this.destination.description
              , distancia:document.getElementById("distanciaEnderecoSugestao").innerHTML
              , tempo:document.getElementById("timeEnderecoSugestao").innerHTML
    };
    console.log(this.destinoMapa);
    console.log(obj);
    await this.service.marcarFavorito(obj);
    $("#sugestaoRota .top #imgFavoritar").hide();
    $("#sugestaoRota .top #imgFavoritarAtivo").show();
    //this.iniciarTracking();
  }
  convertTempo(totalSegundos:any, tipo:any):string{
      var horas="";
      var minutos="";
      var segundos="";
      // Appends 0 when unit is less than 10

      var totalSeconds = parseFloat(totalSegundos); // don't forget the second param
      var hours   = Math.floor(totalSeconds / 3600);
      totalSeconds %= 3600;
      var minutes = Math.floor(totalSeconds / 60);
      var seconds = totalSeconds % 60;

      if (hours   < 10) { horas   = "0"+hours; } else { horas = hours.toString(); }
      if (minutes < 10) { minutos = "0"+minutes; } else { minutos = minutes.toString(); }
      if (seconds < 10) { segundos = "0"+seconds; } else { segundos = seconds.toString(); }
      
      
      if(tipo=="horas"){
        if(hours > 0)
          return hours.toString() + "h" + (minutes > 0 ? minutos + " min" : "");
        else if(minutes > 0)
          return hours.toString() + "h" + minutes.toString() + " min";
        else
          return seconds.toString() + " seg";
      }
      else{
        var tempo = horas+':'+minutos+':'+segundos;
        return tempo;
      }
  }
}