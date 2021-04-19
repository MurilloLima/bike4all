import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-entrada',
  templateUrl: './entrada.page.html',
  styleUrls: ['./entrada.page.scss'],
})
export class EntradaPage implements OnInit {

  constructor(private router:Router, public service: AuthService) { 
    

  }
  async ngOnInit() {
    this.myTSFunction();
  }
  myTSFunction(){ var btn = document.getElementById('callMyJSFunction'); btn.onclick.apply(btn); }
  
  async entrar() {
    let retorno = await this.service.get("primeiroacesso");
    this.router.navigateByUrl('/home/mapa');
    //this.router.navigate(["login"]);
  }

}
