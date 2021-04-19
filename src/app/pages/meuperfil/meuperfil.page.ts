import { Component, OnInit } from '@angular/core';
import { MenuController, Platform, ActionSheetController, LoadingController, AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
import { Camera, CameraOptions, PictureSourceType} from '@ionic-native/camera/ngx';
import { Router } from '@angular/router';

const STORAGE_KEY="my_images";

@Component({
  selector: 'app-meuperfil',
  templateUrl: './meuperfil.page.html',
  styleUrls: ['./meuperfil.page.scss'],
})
export class MeuperfilPage implements OnInit {

  foto: string='';
  public cadastro:any={};
  public bikes:any[];  
  public ativo="perfil";
  public fotoUrl="";
  public base64Image:any; 
  images = [];

  constructor(private menu: MenuController
    , private alertController: AlertController
    , private router : Router
    , private service: AuthService
    , private camera: Camera
    , private actionSheetController: ActionSheetController
    , private plt: Platform
    , private loadingController: LoadingController
    ) { }

  
  async ngOnInit() {
    this.plt.ready().then(()=>{
      
    });
  }
  
  public ionViewWillEnter(): void {
    this.loadDados();
  }
  async loadDados(){
    let retorno = await this.plt.getQueryParam("ret");
    console.log(retorno);
    if(retorno)
      this.ativo = retorno;

    await this.loadMeuPerfil();
  }
  async loadMeuPerfil(){
    let retorno = await this.service.get("meuperfil");
    this.cadastro = retorno.cadastro;
    this.bikes = retorno.bikes;
    this.fotoUrl = this.cadastro.urlimagem;
  }
  async salvarDados(){
    //if(!this.cadastro.datanascimento)
    //  this.cadastro.datanascimento="";

    this.cadastro.urlimagem = this.fotoUrl;
    
    let loading = await this.loadingController.create({message:'Carregando...'});
    await loading.present();

    let retorno = await this.service.put("cadastro/" + this.cadastro.id, this.cadastro);

    loading.dismiss();
    if(retorno.sucesso){
      //this.aviso("");
      alert("Registro atualizado com sucesso!");
    }
    //console.log(retorno);
  }
  openNotificacoes(){ 
    this.menu.open('end');
  }
  cadastrarBike(){
    this.router.navigateByUrl('/popup/bikes?n=0');
  }
  abrirBike(n:any){
    this.router.navigateByUrl('/popup/bikes?n=' + n);
  }
  async openMenuBike(n:any){
    
    const alert = await this.alertController.create({
      header: 'O que deseja fazer?',
      buttons: [
        {
          text: 'Editar',
          handler: async data => {
            this.router.navigateByUrl('/popup/bikes?n=' + n);
          }
        },
        {
          text: 'Excluir',
          handler: async data => {
            await this.service.delete("bike/" + n);
            await this.loadMeuPerfil();
          }
        },
        { text: 'Fechar', role: 'cancel', handler: data => { } }
      ]
    });
    await alert.present();
  }
  openMeuPerfil(){ 
    this.router.navigateByUrl('/home/meu-perfil');
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
    this.fotoUrl = ret.image_url;
    loading.dismiss();
  }

  /*FIM FUNCOES PARA IMAGEM*/
}
