import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { Storage, IonicStorageModule } from '@ionic/storage';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

//import { IonicApp, IonicErrorHandler  } from '@ionic/angular';

import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthModule } from './auth/auth.module';
import { AuthGuardService } from "./services/auth-guard.service";
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';

import { Camera } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CustomHttpInterceptor } from './auth/custom-http-interceptor';
import { GoogleMaps} from '@ionic-native/google-maps'
import { ComponentsModule } from './components/components.module';
import { Insomnia } from '@ionic-native/insomnia/ngx';
import { BackgroundGeolocation } from "@ionic-native/background-geolocation/ngx";
import { SocialSharing} from '@ionic-native/social-sharing/ngx'
import { EscolharotaComponent } from './components/escolharota/escolharota.component';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { Facebook } from '@ionic-native/facebook/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { LaunchNavigator } from '@ionic-native/launch-navigator/ngx';


const firebaseConfig = {
  apiKey: "AIzaSyCbqkFr3MMcf5NfRk1oEeuJmTnt9GCpkmE",
  authDomain: "bike4all-f475e.firebaseapp.com",
  databaseURL: "https://bike4all-f475e.firebaseio.com",
  projectId: "bike4all-f475e",
  storageBucket: "bike4all-f475e.appspot.com",
  messagingSenderId: "507568018642",
  appId: "1:507568018642:web:59ae1185a95f078d8c490b",
  measurementId: "G-58YD6T7V59"
};

@NgModule({
  declarations: [AppComponent],  
  entryComponents: [AppComponent,EscolharotaComponent],
    imports: [BrowserModule, ComponentsModule, 
      IonicModule.forRoot(
        {scrollPadding: false,
        scrollAssist: false}), 
      AppRoutingModule, 
      AuthModule,
      HttpClientModule,
      IonicStorageModule.forRoot()
    ], 
    providers: [
      AuthGuardService, LaunchNavigator,
      Insomnia,SocialSharing, Clipboard,
      StatusBar,Geolocation, BackgroundGeolocation,
        SplashScreen, NativeAudio, Camera, File, FileTransfer, WebView,FilePath,
        GoogleMaps, Facebook, GooglePlus, Deeplinks,LocalNotifications,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        { provide: HTTP_INTERCEPTORS, useClass: CustomHttpInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  exports:[EscolharotaComponent]
})
export class AppModule {}
