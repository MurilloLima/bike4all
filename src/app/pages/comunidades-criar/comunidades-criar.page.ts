import { Component, OnInit } from '@angular/core';
import { MenuController, Platform, ActionSheetController, LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';

import { Camera, CameraOptions, PictureSourceType} from '@ionic-native/camera/ngx';
import { Router } from '@angular/router';

const STORAGE_KEY="my_images";

@Component({
  selector: 'app-comunidades-criar',
  templateUrl: './comunidades-criar.page.html',
  styleUrls: ['./comunidades-criar.page.scss'],
})
export class ComunidadesCriarPage implements OnInit {

  foto: string='';
  public cadastro:any={};
  public fotos:any[];  
  public destinos= [];  
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
    let id = await this.plt.getQueryParam("n");
    console.log(id);
    if(id!=null && id!="0")
    {
      let loading = await this.loadingController.create({message:'Carregando...'});
      await loading.present();

      let id = this.plt.getQueryParam("n");
      let retorno = await this.service.get("comunidades/" + id);
      loading.dismiss();

      this.cadastro = retorno.cadastro;
      this.fotoUrl = this.cadastro.urlimagem;
      
    }
    else{
      
      this.cadastro = { privacidade:'publico', dia:'', mes:'', ano:'',niveldificuldade:'moderada' };
      this.fotos = [];
      this.destinos = []; //retorno.destinos;
    }
  }

  async salvarDados(){
    
    let loading = await this.loadingController.create({message:'Carregando...'});
    await loading.present();

    this.cadastro.urlimagem = this.fotoUrl;
    if(this.cadastro.id>0)
    {
      let retorno = await this.service.put("comunidades/" + this.cadastro.id, this.cadastro);
      loading.dismiss();
      this.voltar();
    }
    else{
      let retorno = await this.service.post("comunidades", this.cadastro);
      loading.dismiss();
      this.voltar();
    }

  }
  async incluirDestino(){
    this.destinos.push({endereco:''});
  }
  async removerDestino(){
    this.destinos.push({endereco:''});
  }

  openMeuPerfil(){ 
    this.router.navigateByUrl('/home/meu-perfil');
  }
  openNotificacoes(){ 
    this.menu.open('end');
  }
  voltar(){ 
    this.router.onSameUrlNavigation ='reload';
    this.router.navigate(['home/comunidades', {dummyData: (new Date).getTime()}]);
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
    
    let ret = await this.service.postAny("v1/upload?var=postAny",{ image: this.base64Image });
    this.fotoUrl = ret.image_url;
  }

  /*FIM FUNCOES PARA IMAGEM*/
}
