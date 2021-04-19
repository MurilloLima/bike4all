import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-termos-de-uso',
  templateUrl: './termos-de-uso.component.html',
  styleUrls: ['./termos-de-uso.component.scss'],
})
export class TermosDeUsoComponent implements OnInit {

  constructor(private modalCtrl:ModalController) { }

  ngOnInit() {}

  close(){
    this.modalCtrl.dismiss({data:"fechou"});
  }
}
