import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-esquecisenha',
  templateUrl: './esquecisenha.page.html',
  styleUrls: ['./esquecisenha.page.scss'],
})
export class EsquecisenhaPage implements OnInit {

  public email:string="";
  constructor(private router:Router, private auth:AuthService ) { }

  ngOnInit() {

  }
  recuperar() {
    if(this.email==""){
      //mensagem
    }
    //this.router.navigateByUrl('register');
  }
  voltar() {
      this.router.navigateByUrl('login');
  }


}
