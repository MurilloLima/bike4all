import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-centralajuda',
  templateUrl: './centralajuda.component.html',
  styleUrls: ['./centralajuda.component.scss'],
})
export class CentralajudaComponent implements OnInit {

  constructor(private modalCtrl:ModalController) { }

  ngOnInit() {}

  close(){
    this.modalCtrl.dismiss({data:"fechou"});
  }
}
