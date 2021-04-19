import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from '../auth.service';
import { ToastController, LoadingController, Platform } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
//import { NativeStorage } from 'ionic-native';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

    isLoggedIn = false;
    users = { id: '', name: '', email: '', picture: { data: { url: '' } } };
    leu:any;
    destino:any="";
    email:any="";

    constructor(private fb: Facebook
        //, private nativeStorage: NativeStorage
        , private googlePlus: GooglePlus
        , private storage:Storage
        , private authService: AuthService
        , private router: Router
        , private loadingController: LoadingController
        , public toastController: ToastController
        , public alertController: AlertController
        , private platform: Platform
        , private service: AuthService
        , private localNotifications: LocalNotifications) {
            this.destino="";
        fb.getLoginStatus()
        .then(res => {
            console.log(res.status);
            if (res.status === 'connect') {
                this.isLoggedIn = true;
            } else {
                this.isLoggedIn = false;
            }
        })
        .catch(e => console.log(e));
    }
    /* FACEBOOK */
    async fbLogin() {
        
        let loading = await this.loadingController.create({message:'Carregando...'});
        await loading.present();

        this.fb.login(['public_profile',  'email'])
        .then(response => {
            if (response.status === 'connected') {
                this.isLoggedIn = true;
                let userId = response.authResponse.userID;

                this.authService.post("teste", {modulo:'facebook', texto:'logou'} );
                
                this.fb.api('/' + userId + '/?fields=id,email,name,picture', ['public_profile'])
                .then(user => {
                    console.log(user);
                    //this.users = user;
                    //user.picture = "https://graph.facebook.com/" + userId + "/picture?type=large";
                    
                    this.authService.post("teste", {modulo:'facebook', texto:JSON.stringify(user)} );
                    var dados = {   
                        username:user.email, 
                        nome: user.name,
                        senha:userId, 
                        datanascimento: '',
                        sexo: '',
                        externo: "facebook"
                    };

                    this.authService.post("teste", {modulo:'facebook', texto: JSON.stringify(dados)} );
                    this.authService.loginExterno(dados ).subscribe((res) => {
                            
                        this.authService.post("teste", {modulo:'facebook', texto:'logou externo'} );
                        this.authService.post("teste", {modulo:'facebook', texto:JSON.stringify(res)} );
                        loading.dismiss();
                        
                        if(this.destino!=""){
                            this.router.navigateByUrl(this.destino);
                        } else {
                            if(res.primeiravez=="1"){
                                this.router.navigateByUrl('/entrada');
                            }else {
                                this.router.navigateByUrl('/home/mapa');
                            }
                        }
                        
                    }, (err) => {
                            this.authService.post("teste", {modulo:'facebook', texto:'erro'} );
                            this.authService.post("teste", {modulo:'facebook', texto:JSON.stringify(err)} );
                            loading.dismiss();
                            if (err.status == "400") {
                                this.authService.post("teste", {modulo:'facebook', texto:'400'} );

                            }
                            if (err.status == "401") {
                                this.presentAlert("Usuário senha incorretos.");
                            }
                            if (err.error != undefined && err.error != "") {
                                this.authService.post("teste", {modulo:'facebook', texto:JSON.stringify(err.error)} );
                                this.presentAlert(err.error);
                            }

                        });
                    loading.dismiss();
                })
                .catch(e => {
                    console.log(e);
                    loading.dismiss();
                });
            } else {
                this.isLoggedIn = false;
                loading.dismiss();
            }
        })
        .catch(e => {
            loading.dismiss();
        });
    }
    
    logout() {
        this.fb.logout()
        .then( res => this.isLoggedIn = false)
        .catch(e => console.log('Error logout from Facebook', e));
    }
    /* FIM FACEBOOK */
    /* GOOGLE PLUS */
    async doGoogleLogin (){
            
        let loading = await this.loadingController.create({message:'Carregando...'});
        await loading.present();

        this.authService.post("teste", {modulo:'google', texto:'entrou'} );   

        this.googlePlus.login({
            'scopes': 'profile email', // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
            'webClientId': '507568018642-7c4gep0et4vjsgnqpulbtu74092oet3s.apps.googleusercontent.com', // optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
            'offline': true // Optional, but requires the webClientId - if set to true the plugin will also return a serverAuthCode, which can be used to grant offline access to a non-Google server
        })
        .then(user =>{
            
            this.isLoggedIn = true;
            let userId = "";

            this.authService.post("teste", {modulo:'google', texto:'logou'} );           
            this.authService.post("teste", {modulo:'google', texto:JSON.stringify(user)} );
            var dados = {   
                username:user.email, 
                nome: user.displayName,
                senha: user.userId, 
                datanascimento: '',
                sexo: '',
                externo: "google",
                picture: user.imageUrl
            };

            this.authService.post("teste", {modulo:'google', texto: JSON.stringify(dados)} );
            this.authService.loginExterno(dados ).subscribe((res) => {
                    
                this.authService.post("teste", {modulo:'google', texto:'logou externo'} );
                this.authService.post("teste", {modulo:'google', texto:JSON.stringify(res)} );
                loading.dismiss();
                
                if(this.destino!=""){
                    this.router.navigateByUrl(this.destino);
                } else {
                    if(res.primeiravez=="1"){
                        this.router.navigateByUrl('/entrada');
                    }else {
                        this.router.navigateByUrl('/home/mapa');
                    }
                }
                
            }, (err) => {
                    this.authService.post("teste", {modulo:'google', texto:'erro'} );
                    this.authService.post("teste", {modulo:'google', texto:JSON.stringify(err)} );
                    loading.dismiss();
                    if (err.status == "400") {
                        this.authService.post("teste", {modulo:'google', texto:'400'} );

                    }
                    if (err.status == "401") {
                        this.presentAlert("Usuário senha incorretos.");
                    }
                    if (err.error != undefined && err.error != "") {
                        this.authService.post("teste", {modulo:'google', texto:JSON.stringify(err.error)} );
                        this.presentAlert(err.error);
                    }

                });
            loading.dismiss();
            
        }, err =>{
            
            this.authService.post("teste", {modulo:'google', texto: err} );   
            this.isLoggedIn = false;
            console.log(err)
            loading.dismiss();
        });
    
    }
    doGoogleLogout(){
        this.googlePlus.logout()
        .then(res =>{
            //user logged out so we will remove him from the NativeStorage
            //this.nativeStorage.remove('google_user');
            this.router.navigate(["/login"]);
        }, err =>{
            console.log(err);
        })
    }
    /* FIM GOOGLE PLUS */
    async presentAlert(msg) {
        const alert = await this.alertController.create({
            header: 'Atenção',
            message: msg,
            buttons: ['OK']
        });

        await alert.present();
    }

    async presentToast() {
        const toast = await this.toastController.create({
            message: 'Your settings have been saved.',
            duration: 2000
        });
        toast.present();
    }

    async login(form) {
        
        let loading = await this.loadingController.create({message:'Carregando...'});
        await loading.present();
        this.authService.login(form.value).subscribe((res) => {
            
            /* 
            await this.storage.set("ACCESS_TOKEN", res.token);
            await this.storage.set("EXPIRES_IN", res.expiresin);
            await this.storage.set("UserId", res.id);
            await this.storage.set("UserNome", res.nome);
            await this.storage.set("UserEmail", res.email);
            */
            console.log(res);
            loading.dismiss();
            if(this.destino!=""){
                this.router.navigateByUrl(this.destino);
            } else {
                if(res.primeiravez=="1"){
                    this.router.navigateByUrl('/entrada');
                }else {
                    this.router.navigateByUrl('/home/mapa');
                }
            }
        }, (err) => {
            console.log(err);
            loading.dismiss();
            if (err.status == "400") {

            }
            if (err.status == "401") {
                this.presentAlert("Usuário senha incorretos.");
            }
            if (err.error != undefined && err.error != "") {
                this.presentAlert(err.error);
            }

        });
    }

    async register(form) {
        
        let loading = await this.loadingController.create({message:'Carregando...'});
        await loading.present();
        console.log(form);
        this.authService.register(form.value).subscribe((res) => {
            console.log(res);
            console.log(res.message);
            this.presentAlert(res.message);
            loading.dismiss();

            this.login(form)
            //this.router.navigateByUrl('home');
        }, (err) => {
            console.log(err);
            loading.dismiss();
            if (err.status == "400") {

            }
            if (err.error != undefined && err.error != "") {
                this.presentAlert(err.message);
                //this.presentToast(err.error);
                //alert(err.error);
            }

        });
    }
    
    async getFromStorageAsync(chave){
        return await this.storage.get(chave);
    }

    getPrimeiraVez(){
        
        this.storage.get('primeiroAcesso').then((result) => {
            console.log(result);
            this.leu = result;
        });

    }

    async ngOnInit() {
        let dest = this.platform.getQueryParam("dest");
        if(dest!="") {
            //this.destino =dest;
            let dados = await this.service.postAny("convite-validar", { codigo: dest });
            if(dados!=null && dados.convite.length>0)
            {
                this.destino = "/popup/" + dados.convit[0].tipo +"?n=" + dados.convit[0].idref;
            }
        }
    }

    public ionViewWillEnter(): void {
        /*
        let dest = this.platform.getQueryParam("dest");
        if(dest!="") {
            //this.destino =dest;
            let dados = this.service.postAny("convite-validar", { codigo: dest });
            if(dados!=null && dados)
            {
                this.destino = "/popup/" + dados.convite[0].tipo +"?n=" + dados.convite[0].idref;
            }
        }*/
    }
    
    async recuperar() {
        if(this.email=="")
        {
            alert("Informe o e-mail que deseja recuperar a senha");
            return;
        }
        
        let dados = await this.service.postAny("recuperarsenha", { email: this.email });
        if(dados!=null && dados)
        {
            if(dados.sucesso)
            {}
            alert(dados.msg);
        }
/*
        alert($("#formLogin #email").val());
        alert(this.email);*/
    }

}
