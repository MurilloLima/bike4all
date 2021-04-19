import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouterEvent } from '@angular/router';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { AuthService } from '../auth/auth.service';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-homepopup',
  templateUrl: './homepopup.page.html',
  styleUrls: ['./homepopup.page.scss'],
})
export class HomepopupPage {

  selectedPath="";
  
  constructor(private auth:AuthService ,private router : Router, private nativeAudio:NativeAudio,  
      public menuCtrl: MenuController) {
    this.router.events.subscribe((event:RouterEvent)=> {
      this.selectedPath=event.url;
    });
    
  }

  closeMenu() {
    console.log('fecharmenu');
    this.menuCtrl.close();
  }

  volumeOn(){
    // can optionally pass a callback to be called when the file is done playing
    //this.nativeAudio.loop('musica');
  }
  volumeOff(){
    //this.nativeAudio.stop('musica').then();
  }
  sair(){
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }

  async ngOnInit(){
    
   //this.nome = await this.storage.get("UserNome");
  }


}
