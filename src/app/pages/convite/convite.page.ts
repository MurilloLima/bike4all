import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-convite',
  templateUrl: './convite.page.html',
  styleUrls: ['./convite.page.scss'],
})
export class ConvitePage implements OnInit {

  loading:any;
  constructor(private route: ActivatedRoute, 
    private loadingCtrl: LoadingController, private router:Router, private service:AuthService) { }

  async ngOnInit() {    
    
    this.loading = await this.loadingCtrl.create({message:'Por favor, aguarde...'});
    await this.loading.present();

    let slug = this.route.snapshot.paramMap.get('slug');
    //alert(slug);
    
    let dados = await this.service.postAny("v1/convite-validar", { codigo: slug });
    //alert(JSON.stringify(dados));

    var internalPath="/login?dest=" + slug;
    if(dados!=null && dados.convite.length>0)
    {
      internalPath = "/popup/" + dados.convite[0].tipo +"?n=" + dados.convite[0].idref;
    }
    this.router.navigateByUrl(internalPath);
    
    this.loading.dismiss();
  }

}
