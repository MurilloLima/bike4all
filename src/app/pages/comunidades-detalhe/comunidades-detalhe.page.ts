import { Component, OnInit } from '@angular/core';
import { MenuController, Platform, LoadingController, AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { SocialSharing} from '@ionic-native/social-sharing/ngx'
import { Clipboard } from '@ionic-native/clipboard/ngx';

@Component({
  selector: 'app-comunidades-detalhe',
  templateUrl: './comunidades-detalhe.page.html',
  styleUrls: ['./comunidades-detalhe.page.scss'],
})
export class ComunidadesDetalhePage implements OnInit {

  
  public cadastro:any= { urlimagem:''};  
  public rotas:any[];

  constructor(private menu: MenuController,private router : Router
    , private service: AuthService, private plt: Platform
    , private loadingController:LoadingController
    , private alertController: AlertController
    , private socialSharing: SocialSharing
    , private clipboard: Clipboard
    , private toastCtrl: ToastController) { }

  ngOnInit() {
    //this.loadPasseios();
  }

  public ionViewWillEnter(): void {
    this.loadPasseios();
  }
  async loadPasseios(){
    
    let loading = await this.loadingController.create({message:'Carregando...'});
    await loading.present();

    loading.dismiss();
    let id = this.plt.getQueryParam("n");
    let retorno = await this.service.get("comunidades/" + id);

    loading.dismiss();
    this.cadastro = retorno.cadastro;
    this.rotas = retorno.rotas_semanais;
  }

  openMeuPerfil(){ 
    this.router.navigateByUrl('/home/meu-perfil');
  }
  async ingressar(){
    let loading = await this.loadingController.create({message:'Carregando...'});
    await loading.present();

    let retorno = await this.service.post("comunidadesingressar/" + this.cadastro.id,"");
    loading.dismiss();

    this.loadPasseios();
  }
  async sair(){
    
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirmação',
      message: 'Deseja realmente sair da comunidade?',
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

            await alert.present();
        
            let loading = await this.loadingController.create({message:'Carregando...'});
            await loading.present();
        
            let retorno = await this.service.put("comunidadessair/" + this.cadastro.id,"");
            loading.dismiss();
        
            this.loadPasseios();
          }
        }
      ]
    });
    await alert.present();

  }
  
  async excluirComunidade(){
    
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirmação',
      message: 'Deseja realmente excluir da comunidade?',
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

                    
            
            let loading = await this.loadingController.create({message:'Carregando...'});
            await loading.present();

            let retorno = await this.service.delete("comunidades/" + this.cadastro.id);
            loading.dismiss();
            
            this.voltar();
          }
        }
      ]
    });
    await alert.present();
  }
  
  async editarComunidade(){
    this.router.navigateByUrl('/popup/comunidades-criar?n=' + this.cadastro.id);
  }
  
  async mudarPrivacidade(){
    let loading = await this.loadingController.create({message:'Carregando...'});
    await loading.present();

    let retorno = await this.service.put("comunidadesprivacidade/" + this.cadastro.id,"");
    loading.dismiss();

    this.loadPasseios();
  }
  
  async convidarAdmin(){
    let loading = await this.loadingController.create({message:'Carregando...'});
    await loading.present();

    loading.dismiss();
  }
  novoPasseio(){ 
    this.router.navigateByUrl('/popup/passeios-criar?idcomunidade=' + this.cadastro.id);
  }

  novaRota(){ 
    this.router.navigateByUrl('/popup/rota-semanal-criar?idcomunidade=' + this.cadastro.id);
  }

  openRota(item:any){ 
    this.router.navigateByUrl('/popup/rota-semanal?n=' + item);
  }

  
  
  openNotificacoes(){ 
    this.menu.open('end');
  }
  voltar(){ 
    
    this.router.onSameUrlNavigation ='reload';
    this.router.navigate(['home/comunidades', {dummyData: (new Date).getTime()}]);
    
    //this.router.navigateByUrl('/home/comunidades?n=0');
  }
  
  async copiar() {
    //this.socialSharing.share("Compartilhando por URL.", null, this.fotoUrl, null);
    console.log("entrou no copiar");
    this.clipboard.copy("https://bike4all.com.br/c/?d=" + this.cadastro.codigoconvite);
    let toast = await this.toastCtrl.create({
      message: 'URL copiada',
      duration: 3000,
      position: 'bottom'
    });
      
    toast.present();
  }
  async compartilhar() {
    //this.socialSharing.share("Compartilhando por URL.", null, this.fotoUrl, null);
    console.log("entrou no compartilhar");
    var imagemurl = (this.cadastro.urlimagem!=undefined?this.cadastro.urlimagem:'');
    var conviteurl = "https://bike4all.com.br/c/?d=" + this.cadastro.codigoconvite;


    this.socialSharing.share("Venha conhecer a comunidade ", null, imagemurl, conviteurl);
  }

}
