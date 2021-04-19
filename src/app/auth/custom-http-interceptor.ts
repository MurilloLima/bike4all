
import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { HttpInterceptor } from '@angular/common/http';
import { HttpRequest } from '@angular/common/http';
import { HttpHandler } from '@angular/common/http';
import { HttpEvent } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { from as fromPromise, Observable} from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class CustomHttpInterceptor implements HttpInterceptor {
  constructor(private msalService: AuthService) {}
  
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    /*console.log("interceptou");
    console.log(request);
    console.log(next);

    if(request.url.indexOf("bike4all")>=0){ console.log("EBAAAAA");}*/
    return fromPromise(this.handleAccess(request, next));
  }
  
  private async handleAccess(request: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {
    const token = await this.msalService.getFromStorageAsync('ACCESS_TOKEN');
    let changedRequest = request;
    // HttpHeader object immutable - copy values
    const headerSettings: {[name: string]: string | string[]; } = {};

    for (const key of request.headers.keys()) {
      headerSettings[key] = request.headers.getAll(key);
    }
    
    if(request.url.indexOf("bike4all.com.br/readimage.php")>=0){
      //headerSettings['Content-Type'] = 'text/html';
      console.log("sem bear");
    }
    else if(request.url.indexOf("bike4all")>=0 && request.url.indexOf("bike4all.com.br/readimage.php")<0){
      if (token) {
        headerSettings['Authorization'] = 'Bearer ' + token;
      }
      headerSettings['Content-Type'] = 'application/json';
    }
    const newHeader = new HttpHeaders(headerSettings);

    changedRequest = request.clone({
      headers: newHeader});
    return next.handle(changedRequest).toPromise();
   
  }

}