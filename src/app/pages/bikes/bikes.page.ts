import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MenuController, Platform, ActionSheetController, ToastController, LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
import { Camera, CameraOptions, PictureSourceType} from '@ionic-native/camera/ngx';
import { File, FileEntry } from '@ionic-native/file/ngx';
import { HttpClient } from '@angular/common/http';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';

import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';

const STORAGE_KEY="my_images";
@Component({
  selector: 'app-bikes',
  templateUrl: './bikes.page.html',
  styleUrls: ['./bikes.page.scss'],
})
export class BikesPage implements OnInit {

  foto: string='';
  public cadastro:any={};
  public fotos:any[];  
  public chassi:any[];  
  
  public fotoUrl="";
  public base64Image:any; 
  images = [];

  constructor(private menu: MenuController
    , private router : Router
    , private service: AuthService
    , private camera: Camera
    , private actionSheetController: ActionSheetController
    , private plt: Platform
    , private loadingController: LoadingController
    ) { 
      this.cadastro={nome:"", tipobicicleta:"", marca:"", cor:"",modelo:""};
      this.chassi = [{numero:""}];
      this.fotos = [];
    }


    async ngOnInit() {
  
      
      this.plt.ready().then(()=>{
        //this.loadStoredImages();
      });
    }
    public ionViewWillEnter(): void {
      let id = this.plt.getQueryParam("n");
      console.log(id);
      if(id!=null && id!="" && id!="0"){
        this.loadBike();
      } else { }
    }
    
  async loadBike(){
    let id = this.plt.getQueryParam("n");
    console.log(id);
    let retorno = await this.service.get("bike/" + id);

    this.cadastro = retorno.cadastro;
    
    this.chassi = retorno.chassi;
    this.fotos = retorno.fotos;
  }

  openMeuPerfil(){ 
    this.router.navigateByUrl('/home/meu-perfil');
  }
  async voltar(){
    this.router.navigateByUrl('/home/meuperfil?ret=bikes');
  }
  async salvarDados(){
    
    let loading = await this.loadingController.create({message:'Carregando...'});
    await loading.present();

    //if(!this.cadastro.datanascimento)
    //  this.cadastro.datanascimento="";
    if(this.cadastro.id>0)
    {
      this.cadastro.chassi = this.chassi;
      this.cadastro.fotos = this.fotos;

      let retorno = await this.service.put("bike/" + this.cadastro.id, this.cadastro);
      console.log(retorno);
      loading.dismiss();
      if(retorno.sucesso){
        this.voltar();
      }else { alert(retorno.message);}
    }
    else{
      this.cadastro.chassi = this.chassi;
      this.cadastro.fotos = this.fotos;

      let retorno = await this.service.post("bike", this.cadastro);
      console.log(retorno);
      loading.dismiss();
      if(retorno.sucesso){
        this.voltar();
      }else { alert(retorno.message);}
    }
  }

      
    openNotificacoes(){ 
      this.menu.open('end');
    }


  
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
    this.fotos.push({imagem: ret.image_url});
    loading.dismiss();
  }

  addLinhaChassi()
  {
    this.chassi.push({numero:""});
  }

  /*FIM FUNCOES PARA IMAGEM*/
  
  
  }
  