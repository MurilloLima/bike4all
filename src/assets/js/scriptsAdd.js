var ambiente = "STAGE";


if(ambiente=="STAGE"){


var urlDom  = "https://projetos.mangu.com.br/bike4all/";
var urlApi  = "https://projetos.mangu.com.br/bike4all/api/";
var urlCdn  = "https://projetos.mangu.com.br/bike4all/cdn/";

}else{

  var urlDom  = "";
  var urlApi  = "";
  var urlCdn  = "";

}


// COMANDO POR VOZ
var comandosPorVoz = "nao";
var noteContent;

try {
  var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  var recognition = new SpeechRecognition();
   comandosPorVoz = "sim";
    
  recognition.onstart = function() { 
    aviso('Fale o destino em que deseja pedalar.','Fale pausadamente para uma melhor captura do seu áudio');
  }

  recognition.onspeechend = function() {
    aviso('Não estou conseguindo te ouvir.','Tente falar pausadamente e mais próximo do seu disposítivo');
  }


  recognition.onerror = function(event) {
    if(event.error == 'no-speech') {
      aviso('Ocorreu um erro. Tente novamente','Não conseguimos acesso ao seu microfone.');  
    };
  }

  recognition.onresult = function(event) {
    var current = event.resultIndex;
    var transcript = event.results[current][0].transcript;
    $("#destino").val(transcript);
  }
}
catch(e) {
  //console.error(e);
  $('#comendoPorVoz').hide();
}



if(comandosPorVoz=="sim"){ 
   $('#comendoPorVoz').on('click', function(e) {
      recognition.start();
      // PARANDO DE OUVIR EM 7 SEGUNDOS
      setTimeout("recognition.stop();", 7000);    
      $("#destino").focus();
  });
}

// FECHAR O WIZARD/INTRODUÇÃO AO ABRIR O APLICATIVO
function closeWizard(){
  $(".wizards").css("bottom","-200%");
  $("#carousel-custom-dots").remove();
}

// VALIDAR SE API ESTÁ ATIVA
function apiAtiva(){
  // INICIO CHAMADA AJAX
       
  console.log("%c VERIFICAÇÃO DE DISPONIBILIDADE DE API","background:#ff0000;color:#fff;");
  return;
  var request = $.ajax({
      method: "POST",
      url: urlApi+"ext/v1/testeapi",
      //data:{tokenConvenia:tokenConvenia}
  })
  request.done(function (dados) {            
      console.log("%c VERIFICAÇÃO DE DISPONIBILIDADE DE API","background:#ff0000;color:#fff;");
      console.log(dados);
  });
  request.fail(function (dados) {
        console.log("API NÃO DISPONÍVEL (apiAtiva)");
        console.log(dados);                                  
  });
  // FINAL CHAMADA AJAX
}



// ATIVAR MENU CLICADO

function ativarMenu(menu,seletor){
   // DESATIVAR EVENTUAIS MENUS ATIVOS
   desativarMenus();

   console.log("%c INICIANDO FUNÇÃO PARA ATIVAR MENU CLICADO: "+menu,"background:#DB541E;color:#fff");

   if(menu==1){
    $("#menuAtividades a").addClass("ativo");
    $("#menuAtividades a img").attr("src","/assets/images/menu-atividades-ativo.svg");
   }

   if(menu==2){
    $("#menuPerformance a").addClass("ativo");
    $("#menuPerformance a img").attr("src","/assets/images/menu-performance-ativo.svg");
   }

   if(menu==3){
    $("#menuMapa a").addClass("ativo");
    $("#menuMapa a img").attr("src","/assets/images/menu-mapa-ativo.svg");
   }

   if(menu==4){
    $("#menuPasseios a").addClass("ativo");
    $("#menuPasseios a img").attr("src","/assets/images/menu-passeios-ativo.svg");
   }

   if(menu==5){
    $("#menuComunidade a").addClass("ativo");
    $("#menuComunidade a img").attr("src","/assets/images/menu-comunidades-ativo.svg");
   }
}

// DESATIVAR TODOS OS MENUS
function desativarMenus(){
  console.log("%c INICIANDO FUNÇÃO PARA DESATIVAR QUALQUER MENU CLICADO","background:#DB541E;color:#fff"); 
  $("footer nav ul li a").removeClass("ativo");
  $("#menuAtividades a img").attr("src","/assets/images/menu-atividades.svg");
  $("#menuPerformance a img").attr("src","/assets/images/menu-performance.svg");
  $("#menuMapa a img").attr("src","/assets/images/menu-mapa.svg");
  $("#menuPasseios a img").attr("src","/assets/images/menu-passeios.svg");
  $("#menuComunidade a img").attr("src","/assets/images/menu-comunidades.svg");
}




// ABRIR MENUS SIDES
var menuLeft = "fechado";
function abrirSideMenuLeft(){
   if(menuLeft=="fechado"){
     console.log("ABRINDO MENU SIDE LEFT");
     $(".sidemenu.sidemenu-left").css("left","0px");
     menuLeft = "aberto";
   }else{
    console.log("FECHANDO MENU SIDE LEFT");
    $(".sidemenu.sidemenu-left").css("left","-110%");
    menuLeft = "fechado";
   }  
}


var menuRight = "fechado";
function abrirSideMenuRight(){
   if(menuRight=="fechado"){
     console.log("ABRINDO MENU SIDE RIGHT");
     $(".sidemenu.sidemenu-right").css("right","0px");
     menuRight = "aberto";
   }else{
    console.log("FECHANDO MENU SIDE RIGHT");
    $(".sidemenu.sidemenu-right").css("right","-110%");
    menuRight = "fechado";
   }
}

// FECHAR SIDE MENUS VIA SWIPE
$("#sideLeft").swipe({
  swipe:function(event, direction, distance, duration, fingerCount) {
    console.log("SWIPE DETECTADO: "+direction);
    if(direction=="left"){
      abrirSideMenuLeft();
    }
  }
});

$("#sideRight").swipe({
  swipe:function(event, direction, distance, duration, fingerCount) {
    console.log("SWIPE DETECTADO: "+direction);
    if(direction=="right"){
      abrirSideMenuRight();
    }
  }
});


/* FUNÇÃO GERAL PARA EXIBIR OS AVISOS DO PÁGINA */
function aviso(titulo,mensagem){
  console.log("%c COMEÇANDO FUNÇÃO PARA EXIBIR AVISO","background:#ff0000;color:#fff;");
  $(".modal-avisos").fadeIn(100);
  $(".modal-avisos .aviso").css("bottom","0");
  // ALIMENTAR O HTML
  $(".aviso h3 span").html(titulo);
  $(".aviso p").html(mensagem+'<p style="padding-top:12px;"><button type="button" onclick="fecharAviso();" class="btn btn-primary">Ok</button></p>');
}

function fecharAviso(){
  $(".modal-avisos .aviso").css("bottom","-30%");
  $(".modal-avisos").fadeOut(500);
}

$("#swipeAviso").swipe({
  swipe:function(event, direction, distance, duration, fingerCount) {
    console.log("SWIPE DETECTADO: "+direction);
    if(direction=="down"){
      fecharAviso()();
    }
  }
});






/* FUNÇÕES REFERENTES AO MAPA (GMAPS) */

// VARIAVEIS GLOBAIS DO MAPA
var input;
var map;
var directionsDisplay; // Instanciaremos ele mais tarde, que será o nosso google.maps.DirectionsRenderer

// SETAR AS COORDANADAS PADRÃO CASO NÃO AS TENHAMOS
var pscLat = "-23.5667005";
var pscLon = "-46.6531514";

function initMapa(){
  //alert("aqui");
   console.log("INICIANDO FUNÇÃO PARA GERAR O MAPA GOOGLEMAPS");
   input = document.getElementById('destino');
   var autoComplete = new google.maps.places.Autocomplete(input);
   var directionsService = new google.maps.DirectionsService();
   google.maps.event.addDomListener(window, 'load', autoComplete);
  localStorage.setItem("latitude",pscLat);
  localStorage.setItem("longitude",pscLon);
  initGeolocation();
}


function carregarMapa(){
  directionsDisplay = new google.maps.DirectionsRenderer(); // Instanciando...
   pscLat = localStorage.getItem("latitude");
   pscLon = localStorage.getItem("longitude");
    var latlng = new google.maps.LatLng(pscLat, pscLon);
    var options = {
       zoom: 15,
       center: latlng,
       scrollwheel: true,
       disableDefaultUI: true,
       draggable: true,
       mapTypeId: google.maps.MapTypeId.ROADMAP,         
       styles: [
       {
         "featureType": "administrative.neighborhood",
         "elementType": "labels",
         "stylers": [{
           "visibility": "off"
         }]
       }, {
         "featureType": "administrative.land_parcel",
         "elementType": "labels",
         "stylers": [{
           "visibility": "off"
         }]
       }, {
         "featureType": "administrative.locality",
         "elementType": "labels",
         "stylers": [{
           "visibility": "off"
         }]
       },
           {
             "elementType": "geometry",
             "stylers": [
               {
                 "color": "#f5f5f5"
               }
             ]
           },
           {
             "elementType": "labels.icon",
             "stylers": [
               {
                 "visibility": "off"
               }
             ]
           },
           {
             "elementType": "labels.text.fill",
             "stylers": [
               {
                 "color": "#616161"
               }
             ]
           },
           {
             "elementType": "labels.text.stroke",
             "stylers": [
               {
                 "color": "#f5f5f5"
               }
             ]
           },
           {
             "featureType": "administrative.land_parcel",
             "elementType": "labels.text.fill",
             "stylers": [
               {
                 "color": "#bdbdbd"
               }
             ]
           },
           {
             "featureType": "poi",
             "elementType": "geometry",
             "stylers": [
               {
                 "color": "#eeeeee"
               }
             ]
           },
           {
             "featureType": "poi",
             "elementType": "labels.text.fill",
             "stylers": [
               {
                 "color": "#757575"
               }
             ]
          },
           {
             "featureType": "poi.park",
             "elementType": "geometry",
             "stylers": [
               {
                 "color": "#e5e5e5"
               }
             ]
           },
           {
             "featureType": "poi.park",
             "elementType": "labels.text.fill",
             "stylers": [
               {
                 "color": "#9e9e9e"
               }
             ]
           },
           {
             "featureType": "road",
             "elementType": "geometry",
             "stylers": [
               {
                 "color": "#ffffff"

               }

             ]

           },

           {

             "featureType": "road.arterial",

             "elementType": "labels.text.fill",

             "stylers": [

               {

                 "color": "#757575"

               }

             ]

           },

           {

             "featureType": "road.highway",

             "elementType": "geometry",

             "stylers": [

               {

                 "color": "#dadada"

               }

             ]

           },

           {

             "featureType": "road.highway",

             "elementType": "labels.text.fill",

             "stylers": [

               {

                 "color": "#616161"

               }

             ]

           },

           {

             "featureType": "road.local",

             "elementType": "labels.text.fill",

             "stylers": [

               {

                 "color": "#9e9e9e"

               }

             ]

           },

           {

             "featureType": "transit.line",

             "elementType": "geometry",

             "stylers": [

               {

                 "color": "#e5e5e5"

               }

             ]

           },

           {

             "featureType": "transit.station",

             "elementType": "geometry",

             "stylers": [

               {

                 "color": "#eeeeee"

               }

             ]

           },

           {

             "featureType": "water",

             "elementType": "geometry",

             "stylers": [

               {

                 "color": "#c9c9c9"

               }

             ]

           },

           {

             "featureType": "water",

             "elementType": "labels.text.fill",

             "stylers": [

               {

                 "color": "#9e9e9e"

               }

             ]

           }

         ]     

    };

    map = new google.maps.Map(document.getElementById("mapa"), options);
    directionsDisplay.setMap(map); // Relacionamos o directionsDisplay com o mapa desejado
    var image = {
      url: '/assets/images/gps.svg',
        size: new google.maps.Size(40, 60),
        origin: new google.maps.Point(0,0),
        anchor: new google.maps.Point(40, 24)
      };

    var marker = new google.maps.Marker({
        icon: image,
        position: latlng,
        map: map,
    });

    google.maps.event.addListener(marker,'click',function(){
        aviso('O que significa esse ícone?','Segundo o seu GPS, essa é a sua localização atual');
    });
}






// APÓS O CLICK EM UM LOCAL, VAMOS APAGAR O MAPA, E FAZER APARECER A SELEÇÃO DO TIPO DE TREINO
$("#destino").change(function(){
  // FAZER APARECER NA TELA A DIV PARA SALVAR O DESTINO
  console.log("DESTINO ESCOLHIDO");
  var destinoEscolhido = $("#destino").val();
  //$("#mapa").fadeOut("250");
  console.log("DESTINO ESCOLHIDO: "+destinoEscolhido);
  localStorage.setItem("destinoTreino",destinoEscolhido);
});

// CORREÇÃO PARA SELEÇÃO DO DESTINO ONMOBILE
$(document).on({
    'DOMNodeInserted': function() {
        $('.pac-item, .pac-item span', this).addClass('no-fastclick');
        //$(".tepping-flex").fadeOut("250");
        //$(".caixa-sugestoes-treinos").fadeOut();
        console.log("PAC GOOGLE");
    }
}, '.pac-container');

function salvarDestinoKeyUp(){
  var destinoEscolhido = $("#destino").val();
  //$("#mapa").fadeOut("250");
  console.log("DESTINO ESCOLHIDO: "+destinoEscolhido);
  localStorage.setItem("destinoTreino",destinoEscolhido);
}

// INICIALIZAR GEOLOCATION
function initGeolocation(){
      if( navigator.geolocation )
       {
          // Call getCurrentPosition with success and failure callbacks
          navigator.geolocation.getCurrentPosition( success, fail );
       }
       else
       {
          aviso("Sem GPS","Não conseguimos acessar o seu GPS. Mas não se preocupe, você poderá utilizar o aplicativo mesmo assim.");
       }
       function success(position) {
            var cordenadas = "";
            cordenadas = position.coords.longitude;
            cordenadas = cordenadas+", ";
            cordenadas = cordenadas + position.coords.latitude;
            // SETAR AS NOVAS COORDENADAS
            pscLat = position.coords.latitude;
            pscLon = position.coords.longitude;

            console.log("LAT NEW: "+pscLat);
            console.log("LON NEW: "+pscLon);

            // SALVAR NA MEMORIA A POSIÇÃO ATUAL DO USUARIO
            if(pscLat!="" && pscLon!=""){
              localStorage.setItem("latitude",pscLat);
              localStorage.setItem("longitude",pscLon);
            }

            // SE TIVERMOS A LOCALIZAÇÃO ATUAL, A GENTE COMEÇA A EXIBIR O MAPA A PARTIR DESSE PONTO
            if(pscLat!="" && pscLon!=""){
                console.log("Coordenadas foram obtidas sem maiores problemas.");
                carregarMapa();
            }else{
                aviso("Problemas com o GPS","Conseguimos obter os dados do seu GPS, mas os mesmos não estão no formato esperado. Mas não se preocupe, você poderá utilizar o aplicativo mesmo assim.");
                carregarMapa();
            }
        }
        function fail() {
            aviso("Sem GPS","Não conseguimos acessar o seu GPS, por causa de um problema de permissões no disposítivo. Mas não se preocupe, você poderá utilizar o aplicativo mesmo assim.");
            carregarMapa();
        }
    }








// ASSISTIR CAMINHADA

// HISTÓRICO DO PERCUSO FICARÁ SALVO NA VARIAVEL PATH

var path = [];

function gravarPercurso(){

        



        setTimeout("fecharSugestao()",1000);

        

        console.log("INICIANDO FUNÇÃO PARA GRAVAR O PERCURSO DO USUÁRIO");        



        $("section.caminhos-alertas-topo").css("top","0px");

        $(".toolbar-flutuante").fadeIn("500");



        navigator.geolocation.watchPosition(function(position) {

          

          // OBTENDO AS COORDENADAS ATUAIS DO USUÁRIO

          path.push(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));

          

          var myOptions = {

            zoom : 15,

            center : path[0],

            scrollwheel: true,

            disableDefaultUI: true,

            draggable: true,

            mapTypeId: google.maps.MapTypeId.ROADMAP,         

              styles: [

              {

                "featureType": "administrative.neighborhood",

                "elementType": "labels",

                "stylers": [{

                  "visibility": "off"

                }]

              }, {

                "featureType": "administrative.land_parcel",

                "elementType": "labels",

                "stylers": [{

                  "visibility": "off"

                }]

              }, {

                "featureType": "administrative.locality",

                "elementType": "labels",

                "stylers": [{

                  "visibility": "off"

                }]

              },

                  {

                    "elementType": "geometry",

                    "stylers": [

                      {

                        "color": "#f5f5f5"

                      }

                    ]

                  },

                  {

                    "elementType": "labels.icon",

                    "stylers": [

                      {

                        "visibility": "off"

                      }

                    ]

                  },

                  {

                    "elementType": "labels.text.fill",

                    "stylers": [

                      {

                        "color": "#616161"

                      }

                    ]

                  },

                  {

                    "elementType": "labels.text.stroke",

                    "stylers": [

                      {

                        "color": "#f5f5f5"

                      }

                    ]

                  },

                  {

                    "featureType": "administrative.land_parcel",

                    "elementType": "labels.text.fill",

                    "stylers": [

                      {

                        "color": "#bdbdbd"

                      }

                    ]

                  },

                  {

                    "featureType": "poi",

                    "elementType": "geometry",

                    "stylers": [

                      {

                        "color": "#eeeeee"

                      }

                    ]

                  },

                  {

                    "featureType": "poi",

                    "elementType": "labels.text.fill",

                    "stylers": [

                      {

                        "color": "#757575"

                      }

                    ]

                  },

                  {

                    "featureType": "poi.park",

                    "elementType": "geometry",

                    "stylers": [

                      {

                        "color": "#e5e5e5"

                      }

                    ]

                  },

                  {

                    "featureType": "poi.park",

                    "elementType": "labels.text.fill",

                    "stylers": [

                      {

                        "color": "#9e9e9e"

                      }

                    ]

                  },

                  {

                    "featureType": "road",

                    "elementType": "geometry",

                    "stylers": [

                      {

                        "color": "#ffffff"

                      }

                    ]

                  },

                  {

                    "featureType": "road.arterial",

                    "elementType": "labels.text.fill",

                    "stylers": [

                      {

                        "color": "#757575"

                      }

                    ]

                  },

                  {

                    "featureType": "road.highway",

                    "elementType": "geometry",

                    "stylers": [

                      {

                        "color": "#dadada"

                      }

                    ]

                  },

                  {

                    "featureType": "road.highway",

                    "elementType": "labels.text.fill",

                    "stylers": [

                      {

                        "color": "#616161"

                      }

                    ]

                  },

                  {

                    "featureType": "road.local",

                    "elementType": "labels.text.fill",

                    "stylers": [

                      {

                        "color": "#9e9e9e"

                      }

                    ]

                  },

                  {

                    "featureType": "transit.line",

                    "elementType": "geometry",

                    "stylers": [

                      {

                        "color": "#e5e5e5"

                      }

                    ]

                  },

                  {

                    "featureType": "transit.station",

                    "elementType": "geometry",

                    "stylers": [

                      {

                        "color": "#eeeeee"

                      }

                    ]

                  },

                  {

                    "featureType": "water",

                    "elementType": "geometry",

                    "stylers": [

                      {

                        "color": "#c9c9c9"

                      }

                    ]

                  },

                  {

                    "featureType": "water",

                    "elementType": "labels.text.fill",

                    "stylers": [

                      {

                        "color": "#9e9e9e"

                      }

                    ]

                  }

                ]  

          }



          var map = new google.maps.Map(document.getElementById("mapa"), myOptions);

          console.log("NOVA COORDENADA DETECTADA, SALVANDO NO OBJETO DE HISTÓRICO PATH");          

       

          // DESENHANDO O POLYLINE

          var latLngBounds = new google.maps.LatLngBounds();

           

          var cursor = {

                 url: 'images/gps.svg',

                 size: new google.maps.Size(40, 60),

                 origin: new google.maps.Point(0,0),

                 anchor: new google.maps.Point(40, 24)

                };



          var cursor2 = {

                 url: 'images/gps-bike.svg',

                 size: new google.maps.Size(40, 60),

                 origin: new google.maps.Point(0,0),

                 anchor: new google.maps.Point(40, 24)

                };



          var cursor3 = {

                 url: 'images/mini.svg',

                  size: new google.maps.Size(20, 20),

                  origin: new google.maps.Point(0,0),

                  anchor: new google.maps.Point(10, 10)

                };







          for(var i = 0; i < path.length; i++) {

            latLngBounds.extend(path[i]);

            

            // POSICIONAR O CURSOS

            if(i==0){

              new google.maps.Marker({

                map: map,

                icon: cursor,

                position: path[i],

                title: "Você começou o seu trajeto aqui " + (i + 1)

              });

            }else{

              new google.maps.Marker({

                map: map,

                icon: cursor3,

                position: path[i],

                title: "Você está aqui agora " + (i + 1)

              });

            }

          }

          // DESENHAR

          var polyline = new google.maps.Polyline({

            map: map,

            path: path,

            strokeColor: '#F9D699',

            strokeOpacity: 1,

            strokeWeight: 7

          });

          // REOORGANIZAR OS POINTS

          map.fitBounds(latLngBounds);

        },



        // TRATAR OS ERROS

        function(positionError){

          //aviso("Oops! Algo deu errado",positionError.message);

          console.log("%c TIMEOUT PARA OBTER WHATCH POSITION","background:#ff0000;color:#fff;");

        },

        {

          enableHighAccuracy: true,

          timeout: 10 * 1000 // ATUALIZAR A LOCALIZAÇÃO A CADA 10 SEGUNDOS

        });



}





// CLOSE MENUS

function closeMenus(){

   

   console.log("FECHANDO AS NAVEGAÇÕES DA PARTE INFERIOR");

   $("#btnGravar").css("bottom","-90px");

   $("footer").css("bottom","-90px");



}



// OPEN MENUS

function openMenus(){

   

   console.log("REABRINDO AS NAVEGAÇÕES DA PARTE INFERIOR");

   $("#btnGravar").css("bottom","105px");

   $("footer").css("bottom","0px");



}





// INICIAR GRAVAÇÃO

function iniciarGravacao(){

   

   closeMenus();

   setTimeout("sugestaoPercurso()",1000);



}

function sugestaoPercurso(){

   

   console.log("SUGERINDO PERCURSO PARA O USUÁRIO");

   $("#sugestaoRota").css("bottom","0px");



}

function cancelarSugestao(){

    $("#sugestaoRota").css("bottom","-200%");

    setTimeout("openMenus()",1000);

}

function fecharSugestao(){

   $("#sugestaoRota").css("bottom","-200%");

   $("#gpsFooter").css("bottom","-140px");

   $(".conteudo-inner-full").fadeOut(500);



   $(".velocidade").fadeIn("500");

   $(".recentralizar").fadeIn("500");

}



function ativarDetalhesGps(){



  console.log("FUNÇÃO PARA EXIBIR DETALHES DO PERCURSO DO USUÁRIO");

  $("#gpsFooter").css("bottom","0px");

  $(".velocidade").css("bottom","250px");

  $(".recentralizar").css("bottom","250px");



}





$("#gpsFooter").swipe({

            swipe:function(event, direction, distance, duration, fingerCount) {

              console.log("SWIPE DETECTADO: "+direction);

              if(direction=="up"){

                $("#gpsFooter").css("bottom","0px");

              }

              if(direction=="down"){

                $("#gpsFooter").css("bottom","-140px");

                $(".velocidade").css("bottom","114px");

                $(".recentralizar").css("bottom","120px");

              }

            }

});





function recentralizar(){

  

  console.log("AQUI A FUNÇÃO ONDE DEVERÁ COLOCAR O CÓDIGO PARA RECENTRALIZAÇÃO (CASO ESTEJA OPERANDO POR JS)");



}









function incluirMarcacao(){

   

   $(".iniciar-marcacoes").fadeIn("500");



}



function fecharIniciarMarcacoes(){

   

   $(".iniciar-marcacoes").fadeOut("500");



}





// INICIAR GRAVAÇÃO

function iniciarGravacao(){

   

   closeMenus();

   setTimeout("sugestaoPercurso()",1000);



}

function sugestaoPercurso(){

   

   console.log("SUGERINDO PERCURSO PARA O USUÁRIO");

   $("#sugestaoRota").css("bottom","0px");



}

function cancelarSugestao(){

    $("#sugestaoRota").css("bottom","-200%");

    setTimeout("openMenus()",1000);

}

function fecharSugestao(){

   $("#sugestaoRota").css("bottom","-200%");

   $("#gpsFooter").css("bottom","0px");

   $(".conteudo-inner-full").fadeOut(500);

}





function myJSFunction(){     
  apiAtiva();
  console.log("teste");
    $( document ).ready(function() {
      var wizards = $('#wizards').owlCarousel({
              loop:false,
              margin:0,
              items: 1,
              autoplay: false,
              center: false,
              nav: true,
              navText: [
                  'Anterior',
                  'Próximo'
              ],
              autoplayTimeout:3500,
              dotsContainer: '#carousel-custom-dots',
              autoplayHoverPause:false,
              //animateIn: 'fadeIn', // add this
              //animateOut: 'fadeOut', // and this
      });
      // AGORA TEMOS ATÉ DOTS!!!
      $('.owl-dot').click(function () {
        wizards.trigger('to.owl.carousel', [$(this).index(), 300]);
      });
    });         
  } 