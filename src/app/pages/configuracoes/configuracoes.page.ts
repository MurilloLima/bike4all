import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-configuracoes',
  templateUrl: './configuracoes.page.html',
  styleUrls: ['./configuracoes.page.scss'],
})
export class ConfiguracoesPage implements OnInit {

  
  constructor(private menu: MenuController,private router : Router, private service: AuthService) { }

  ngOnInit() {
  }

    
  openMeuPerfil(){ 
    this.router.navigateByUrl('/home/meu-perfil');
  }
  openNotificacoes(){ 
    this.menu.open('end');
  }

}
