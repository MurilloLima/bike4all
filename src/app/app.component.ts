import { Component, NgZone } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';
//import { Environment } from '@ionic-native/google-maps/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { BackgroundGeolocation,BackgroundGeolocationConfig, BackgroundGeolocationResponse, BackgroundGeolocationEvents } from "@ionic-native/background-geolocation/ngx";
import { Deeplinks } from '@ionic-native/deeplinks/ngx';

declare var window;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  arr:any;

  constructor(
        private platform: Platform
        ,private splashScreen: SplashScreen
        ,private statusBar: StatusBar
        ,private router: Router
        ,private auth: AuthService    
        ,private deeplinks: Deeplinks
        ,private zone: NgZone
        ,private nativeAudio:NativeAudio
        ,private backgroundGeolocation:BackgroundGeolocation
  ) {
    this.arr=[];
    this.initializeApp();
  }



  initializeApp() {
    this.platform.ready().then(() => {


        
      const config: BackgroundGeolocationConfig = {
        desiredAccuracy: 10,
        stationaryRadius: 20,
        distanceFilter: 30,
        debug: true, //  enable this hear sounds for background-geolocation life-cycle.
        stopOnTerminate: false // enable this to clear background location settings when the app terminates
      };

      /*
      this.backgroundGeolocation.configure(config).then(() => {
        this.backgroundGeolocation
          .on(BackgroundGeolocationEvents.location)
          .subscribe((location: BackgroundGeolocationResponse) => {
            console.log(location);
            
            var locationstr = localStorage.getItem("loacation");
            if(locationstr ==null)
            {
              this.arr.push(location);
            } else{
              var locationarr = JSON.parse(locationstr);
              this.arr = locationstr;
            }
            localStorage.setItem("location",JSON.stringify(this.arr));
          });
      });
      */
      window.app = this;

      
      this.splashScreen.hide();      
      this.setupDeeplinks();
      this.statusBar.backgroundColorByHexString('#db541e');

      if(this.auth.isLoggedIn())
        this.router.navigate(['home/mapa']);  
      else
        this.router.navigate(['login']);  

    });
  }

  setupDeeplinks() {
    this.deeplinks.route({ '/:slug': 'convite' }).subscribe(
      match => {
        console.log('Successfully matched route', match);
 
        // Create our internal Router path by hand
        const internalPath = `/${match.$route}/${match.$args['slug']}`;
 
        // Run the navigation in the Angular zone
        this.zone.run(() => {
          
          this.router.navigateByUrl(internalPath);
        });
      },
      nomatch => {
        // nomatch.$link - the full link data
        console.error("Got a deeplink that didn't match", nomatch);
      }
    );
  }


}
