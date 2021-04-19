import { Component, OnInit, Input, AfterContentInit, EventEmitter, Output } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';

declare var google;

@Component({
  selector: 'app-custommap',
  templateUrl: './custommap.component.html',
  styleUrls: ['./custommap.component.scss'],
})
export class CustommapComponent implements OnInit , AfterContentInit {
  
  @Input('endereco') endereco: string = "";
  @Input('destino') destino: string = "";
  @Input() destinos: any[];
  @Output() somethingHappen=new EventEmitter();


  map:any;
  posicaoAtual:any;
  originPosition:any;
  destinationPosition:string;
  private googleAutocomplete = new google.maps.places.AutocompleteService();
  
  private directionsDisplay = new google.maps.DirectionsRenderer();
  private directionsService = new google.maps.DirectionsService();
  private directionsRenderer = new google.maps.DirectionsRenderer();
  
  constructor(private geolocation:Geolocation) { 
    
  }
  ngOnInit(): void {
    
  }

  ngAfterContentInit() { 
    if(this.destinos!=null && this.destinos.length >0)
    {
      this.iniciaRotas();  
    }  
    else if(this.endereco!="" && this.destino=="" && (this.destinos==null || this.destinos.length<=0))
    {
      this.iniciaEndereco();  
    }   
    else if(this.endereco!="" && this.destino!="" && (this.destinos==null || this.destinos.length<=0))
    {
      this.iniciaDestino();  
    }   
  }
  public async myCall(item:any){
    console.log("teste");
    console.log(item);
  }
  async iniciaEndereco() {
    console.log("INICIANDO FUNÇÃO PARA GERAR O MAPA GOOGLEMAPS");
    console.log(this.endereco);
    
    var locationRio = {lat: -22.915, lng: -43.197};
    //var endereco="Rua Jurubatuba, 683, Vila Pires, Santo André, SP";

    var geocoder = new google.maps.Geocoder();
    geocoder.geocode( { 'address': this.endereco}, function(resultado, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        
          var localizacaoCentro = {lat: parseFloat(resultado[0].geometry.location.lat()), lng: parseFloat(resultado[0].geometry.location.lng())};
            
          var mapOption = { zoom:18, center: localizacaoCentro
            ,disableDefaultUI:true
            ,mapTypeId: google.maps.MapTypeId.ROADMAP
            /*,mapTypeControl: true
            ,streetViewControl: false
            ,fullscreenControl: false*/
            //,styles: this.estilos
          };

          this.map = new google.maps.Map(document.getElementById('mapaGoogle'), mapOption);
              
          this.marcador = new google.maps.Marker({
            position:localizacaoCentro ,
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
          //criaMarcador(marcador, map)
        } else {
          alert('Erro ao converter endereço: ' + status);
        }
    });

    const mapOption = { 
      zoom:13
      , center: locationRio
      /*,disableDefaultUI:false
      ,mapTypeId: google.maps.MapTypeId.ROADMAP
      ,mapTypeControl: true
      ,streetViewControl: false
      ,fullscreenControl: false*/
      //,styles: this.estilos
    };

    //this.map = new google.maps.Map(document.getElementById('mapaGoogle'), mapOption);
    
    /*
    var bikeLayer = new google.maps.BicyclingLayer();
    bikeLayer.setMap(this.map);

    //this.posicaoAtual = new google.maps.LatLng(-23.6893757, -46.5176941);
    
    this.geolocation.getCurrentPosition().then((resp)=>{
      //this.posicaoAtual = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      this.posicaoAtual = {lat: resp.coords.latitude, lng: resp.coords.longitude};
      this.map.setCenter(this.posicaoAtual);  
      this.map.setZoom(8);  
      
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
        //this.aviso("O que significa esse ícone?","Segundo o seu GPS, essa é a sua localização atual");
        console.log("Clique icone,Segundo o seu GPS, essa é a sua localização atual");
      });

    }).catch((error)=>{
      console.log("Erro ao recuperar sua posição",error);
      //this.aviso("GPS","Sinal de GPS fora do ar.");
      //this.map.setCenter(this.posicaoAtual);    
      //this.map.setZoom(this.posicaoAtual);    

    });*/
  }
  async iniciaDestino() {
    console.log("INICIANDO FUNÇÃO PARA GERAR O MAPA GOOGLEMAPS");
    console.log(this.endereco);
    
    var locationRio = {lat: -22.915, lng: -43.197};
    //var endereco="Rua Jurubatuba, 683, Vila Pires, Santo André, SP";

    var geocoder = new google.maps.Geocoder();
    geocoder.geocode( { 'address': this.endereco}, function(resultado, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        
          var localizacaoCentro = {lat: parseFloat(resultado[0].geometry.location.lat()), lng: parseFloat(resultado[0].geometry.location.lng())};
            
          var mapOption = { zoom:18, center: localizacaoCentro
            ,disableDefaultUI:true
            ,mapTypeId: google.maps.MapTypeId.ROADMAP
            /*,mapTypeControl: true
            ,streetViewControl: false
            ,fullscreenControl: false*/
            //,styles: this.estilos
          };

          this.map = new google.maps.Map(document.getElementById('mapaGoogle'), mapOption);
              
          this.marcador = new google.maps.Marker({
            position:localizacaoCentro ,
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
          //criaMarcador(marcador, map)
        } else {
          alert('Erro ao converter endereço: ' + status);
        }
    });

    const mapOption = { 
      zoom:13
      , center: locationRio
      /*,disableDefaultUI:false
      ,mapTypeId: google.maps.MapTypeId.ROADMAP
      ,mapTypeControl: true
      ,streetViewControl: false
      ,fullscreenControl: false*/
      //,styles: this.estilos
    };

    //this.map = new google.maps.Map(document.getElementById('mapaGoogle'), mapOption);
    
    /*
    var bikeLayer = new google.maps.BicyclingLayer();
    bikeLayer.setMap(this.map);

    //this.posicaoAtual = new google.maps.LatLng(-23.6893757, -46.5176941);
    
    this.geolocation.getCurrentPosition().then((resp)=>{
      //this.posicaoAtual = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      this.posicaoAtual = {lat: resp.coords.latitude, lng: resp.coords.longitude};
      this.map.setCenter(this.posicaoAtual);  
      this.map.setZoom(8);  
      
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
        //this.aviso("O que significa esse ícone?","Segundo o seu GPS, essa é a sua localização atual");
        console.log("Clique icone,Segundo o seu GPS, essa é a sua localização atual");
      });

    }).catch((error)=>{
      console.log("Erro ao recuperar sua posição",error);
      //this.aviso("GPS","Sinal de GPS fora do ar.");
      //this.map.setCenter(this.posicaoAtual);    
      //this.map.setZoom(this.posicaoAtual);    

    });*/
  }
  async iniciaRotas() {
    console.log("INICIANDO FUNÇÃO PARA GERAR O MAPA GOOGLEMAPS ROTAS");
    console.log(this.endereco);

    
    var localizacaoCentro = {lat: -22.915, lng: -43.197};
    var mapOption = { zoom:18, center: localizacaoCentro
      ,disableDefaultUI:true
      ,mapTypeId: google.maps.MapTypeId.ROADMAP
      ,mapTypeControl: false
      ,streetViewControl: false
      ,gestureHandling: 'none'
      ,zoomControl: false
      ,fullscreenControl: false/**/
      //,styles: this.estilos
    };

    this.map = new google.maps.Map(document.getElementById('mapaGoogle'), mapOption);
    this.directionsRenderer.setMap(this.map);

    var enderecoFinal = this.destinos[this.destinos.length-1].endereco;
    var waypts=[];

    for (var i = 1; i < this.destinos.length-1; i++) {
        waypts.push({
          location: this.destinos[i].endereco,
          stopover: true
        });
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
    this.directionsService.route({
      origin: this.endereco,
      destination: enderecoFinal,
      waypoints: waypts,
      optimizeWaypoints: true,
      travelMode: 'BICYCLING'
    }, function(response, status) {
      if (status === 'OK') {

        _self.directionsRenderer.setDirections(response);
      }
        /*this.directionsRenderer.setDirections(response);
        var route = response.routes[0];
        var summaryPanel = document.getElementById('directions-panel');
        summaryPanel.innerHTML = '';
        // For each route, display summary information.
        for (var i = 0; i < route.legs.length; i++) {
          var routeSegment = i + 1;
          summaryPanel.innerHTML += '<b>Route Segment: ' + routeSegment +
              '</b><br>';
          summaryPanel.innerHTML += route.legs[i].start_address + ' to ';
          summaryPanel.innerHTML += route.legs[i].end_address + '<br>';
          summaryPanel.innerHTML += route.legs[i].distance.text + '<br><br>';
        }
      } else {
        window.alert('Directions request failed due to ' + status);
      }*/
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

  /*
  async calcRoute(item:any){
    
    var bikeLayer = new google.maps.BicyclingLayer();
    bikeLayer.setMap(this.map);

    var elevator = new google.maps.ElevationService;

    this.directionsDisplay.setMap(this.map);
    const request = {
      //Pode ser uma coordenada, uma string ou um lugar
      origin: this.posicaoAtual,
      destination: this.destination.description,
      travelMode: 'BICYCLING'
    };

    await this.directionsService.route(request, function(result,status){

      console.log(result);

      if(status=='OK'){
        this.directionsDisplay.setDirections(result);
      
        this.rotas = result.routes;
        
      } 
      else if (status=="NOT_FOUND"){
        console.log('Erro no destino','Não conseguimos encontrar rota para o destino informado.');  
      }
      else { console.log(status);}
    });
  }*/
  

}
