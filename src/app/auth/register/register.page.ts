import { Component, OnInit } from '@angular/core';

import { Router } from "@angular/router";
import { AuthService } from '../auth.service';
import { ToastController, LoadingController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {


    constructor(private authService: AuthService, private router: Router, public toastController: ToastController, public alertController: AlertController
        , private loadingController: LoadingController) { }

    async presentAlert(msg) {
        const alert = await this.alertController.create({
            header: 'Atenção',  
            message: msg,
            buttons: ['OK']
        });

        await alert.present();
    }

    async presentToast(msg) {
        const toast = await this.toastController.create({
            message: msg,
            duration: 2000
        });
        toast.present();
    }

    async register(form) {
        let loading = await this.loadingController.create({message:'Carregando...'});
        await loading.present();
    
        this.authService.register(form.value).subscribe((res) => {
            console.log(res);
            loading.dismiss();
            this.router.navigateByUrl('home');
        }, (err) => {
            loading.dismiss();
            if (err.status == "400") {

            }
            if (err.error != undefined && err.error != "") {
                this.presentAlert(err.error);
                //this.presentToast(err.error);
                //alert(err.error);
            }

        });
    }


    voltar() {
        this.router.navigate(['login']);
    }

    ngOnInit() {
    }

}
