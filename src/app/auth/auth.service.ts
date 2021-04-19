import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';

import { Storage } from '@ionic/storage';
import { User } from './user';
import { AuthResponse } from './auth-response';
import { Platform } from '@ionic/angular';
import { Cupom } from '../interfaces/cupom';
import { CupomMapa } from '../interfaces/cupom-mapa';
import { Retorno } from '../interfaces/retorno';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    //private AUTH_SERVER_ADDRESS: string = 'http://localhost:15666/api';
    //private AUTH_SERVER_ADDRESS: string = 'https://www.cupom2go.com.br/api';
    //private AUTH_SERVER_ADDRESS: string = 'https://projetos.mangu.com.br/bike4all/api';
    private AUTH_SERVER_ADDRESS: string = 'https://bike4all.sslblindado.com/api';
    private authSubject = new BehaviorSubject(false);
    authState = new BehaviorSubject(false);

    constructor(private platform: Platform, private httpClient: HttpClient, private storage: Storage) {
        this.platform.ready().then(() => {
            this.ifLoggedIn();
          });
     }

     async ifLoggedIn() {
        await this.storage.get('ACCESS_TOKEN').then((response) => {
          if (response) {
            this.authSubject.next(true);
            this.authState.next(true);
          }
        });
      }

    register(user: User): Observable<any> {
        return this.httpClient.post<AuthResponse>(`${this.AUTH_SERVER_ADDRESS}/registro`, user).pipe(
            tap(async (res: any) => {

            })

        );
    }
    login( user: User): Observable<AuthResponse> {
        var dados = {username:'leandropn@gmail.com', senha:'leandro'};
        //console.log(dados);
        //console.log(user);

        return this.httpClient.post(`${this.AUTH_SERVER_ADDRESS}/login`, user).pipe(
            tap(async (res: AuthResponse) => {
                //if (res.user) {
                    console.log('logou');
                    await this.storage.set("ACCESS_TOKEN", res.token);
                    await this.storage.set("EXPIRES_IN", res.expiresin);
                    await this.storage.set("UserId", res.id);
                    await this.storage.set("UserNome", res.nome);
                    await this.storage.set("UserEmail", res.email);
                    this.authSubject.next(true);
                    this.authState.next(true);
                //}
            })
        );
    }
    
    loginExterno( dados:any): Observable<AuthResponse> {
        //var user:User= new user();
        //console.log(dados);
        //console.log(user);

        return this.httpClient.post(`${this.AUTH_SERVER_ADDRESS}/loginexterno`, dados).pipe(
            tap(async (res: AuthResponse) => {
                //if (res.user) {
                    console.log('logou');
                    await this.storage.set("ACCESS_TOKEN", res.token);
                    await this.storage.set("EXPIRES_IN", res.expiresin);
                    await this.storage.set("UserId", res.id);
                    await this.storage.set("UserNome", res.nome);
                    await this.storage.set("UserEmail", res.email);
                    this.authSubject.next(true);
                    this.authState.next(true);
                //}
            })
        );
    }

    async logout() {
        await this.storage.remove("ACCESS_TOKEN");
        await this.storage.remove("EXPIRES_IN");
        await this.storage.remove("UserId");
        await this.storage.remove("UserNome");
        await this.storage.remove("UserEmail");
        this.authSubject.next(false);
        this.authState.next(false);
    }

    async isLoggedIn() {
        let token = await this.getFromStorageAsync('ACCESS_TOKEN');
        return token!=undefined && token!="" ? true : false;
    }
    isAuthenticated(){
        return this.authState.value;
    }
    async primeiraVez(){
        return await this.getFromStorageAsync("primeiravez");
    }
    
    async getFromStorageAsync(chave){

        return await this.storage.get(chave);

    }

    
    async getImage(endereco:string ):Promise<any>{
        // Or to get a key/value pair
        let token = await this.getFromStorageAsync('ACCESS_TOKEN');
        let userId = await this.getFromStorageAsync('UserId');
        
        let _headers = {};
        //_headers.append('Content-Type', 'application/json');
        let url = "https://bike4all.com.br/readimage.php?url="+endereco+"" ;

        return this.httpClient.get<any>(url).toPromise();
        
    }
    async getCoordenadas(endereco:string ):Promise<any>{
        // Or to get a key/value pair
        let token = await this.getFromStorageAsync('ACCESS_TOKEN');
        let userId = await this.getFromStorageAsync('UserId');
        
        let _headers = {};
        //_headers.append('Content-Type', 'application/json');
        let url = "https://maps.googleapis.com/maps/api/geocode/json?address="+endereco+"&key=AIzaSyD-jYrotp8S30iZGWsjClbr3xAxltym-pY" ;

        return this.httpClient.get<any>(url).toPromise();
        
    }

    async getClimaCidade(cidade:string,pais:string ):Promise<any>{
        // Or to get a key/value pair
        let token = await this.getFromStorageAsync('ACCESS_TOKEN');
        let userId = await this.getFromStorageAsync('UserId');
        
        let _headers = {};
        //_headers.append('Content-Type', 'application/json');
        let url = "https://api.openweathermap.org/data/2.5/weather?q=" + cidade + "," + pais +"&units=metric&lang=pt_br&appid=8caab7eb9ee00b97380c8e67726f1add" ;

        return this.httpClient.get<any>(url).toPromise();
        
    }
    async getClimaLatLng(latitude:any,longitude:any ):Promise<any>{
        // Or to get a key/value pair
        let token = await this.getFromStorageAsync('ACCESS_TOKEN');
        let userId = await this.getFromStorageAsync('UserId');
        
        let _headers = {};
        //_headers.append('Content-Type', 'application/json');
        let url = "https://api.openweathermap.org/data/2.5/weather?lat=" + latitude + "&lon=" + longitude +"&units=metric&lang=pt_br&appid=8caab7eb9ee00b97380c8e67726f1add" ;

        return this.httpClient.get<any>(url).toPromise();
        
    }


    async getAny(urlEndPoint:string):Promise<any>{
        // Or to get a key/value pair
        let token = await this.getFromStorageAsync('ACCESS_TOKEN');
        let userId = await this.getFromStorageAsync('UserId');
        
        let _headers = {
            Authorization: "Bearer " + token
        };
        
        //_headers.append('Content-Type', 'application/json');
        let url = `${this.AUTH_SERVER_ADDRESS}/${urlEndPoint}` ;

        return this.httpClient.get<any>(url, { headers: _headers}).toPromise();
        
    }
    async postAny(urlEndPoint:string, obj:any):Promise<any>{
        // Or to get a key/value pair
        let token = await this.getFromStorageAsync('ACCESS_TOKEN');
        let userId = await this.getFromStorageAsync('UserId');
        
        let _headers = {
            Authorization: "Bearer " + token
            , 'Content-Type': 'application/json'
        };
        
        let url = `${this.AUTH_SERVER_ADDRESS}/${urlEndPoint}` ;

        return this.httpClient.post<any[]>(url,obj, { headers: _headers}).toPromise();
        
    }
    async get(urlEndPoint:string):Promise<any>{
        // Or to get a key/value pair
        let token = await this.getFromStorageAsync('ACCESS_TOKEN');
        let userId = await this.getFromStorageAsync('UserId');
        
        let _headers = {
            Authorization: "Bearer " + token
        };
        
        let url = `${this.AUTH_SERVER_ADDRESS}/v1/${urlEndPoint}` ;

        return this.httpClient.get<any[]>(url, { headers: _headers}).toPromise();
        
    }
    async post(urlEndPoint:string, obj:any):Promise<any>{
        // Or to get a key/value pair
        let token = await this.getFromStorageAsync('ACCESS_TOKEN');
        let userId = await this.getFromStorageAsync('UserId');
        
        let _headers = {
            Authorization: "Bearer " + token
        };
        
        let url = `${this.AUTH_SERVER_ADDRESS}/v1/${urlEndPoint}` ;

        return this.httpClient.post<any[]>(url,obj, { headers: _headers}).toPromise();
        
    }
    async put(urlEndPoint:string, obj:any):Promise<any>{
        // Or to get a key/value pair
        let token = await this.getFromStorageAsync('ACCESS_TOKEN');
        let userId = await this.getFromStorageAsync('UserId');
        
        let _headers = {
            Authorization: "Bearer " + token
        };
        
        let url = `${this.AUTH_SERVER_ADDRESS}/v1/${urlEndPoint}` ;

        return this.httpClient.put<any[]>(url,obj, { headers: _headers}).toPromise();
        
    }
    async delete(urlEndPoint:string):Promise<any>{
        // Or to get a key/value pair
        let token = await this.getFromStorageAsync('ACCESS_TOKEN');
        let userId = await this.getFromStorageAsync('UserId');
        
        let _headers = {
            Authorization: "Bearer " + token
        };
        
        let url = `${this.AUTH_SERVER_ADDRESS}/v1/${urlEndPoint}` ;

        return this.httpClient.delete<any[]>(url, { headers: _headers}).toPromise();
        
    }




    async marcarFavorito(obj:any):Promise<any>{
        // Or to get a key/value pair
        let token = await this.getFromStorageAsync('ACCESS_TOKEN');
        let userId = await this.getFromStorageAsync('UserId');
        
        let _headers = {
            Authorization: "Bearer " + token
        };
        
        let url = `${this.AUTH_SERVER_ADDRESS}/v1/marcarfavorito`;

        return this.httpClient.post<Retorno>(url,obj,  { headers: _headers}).toPromise();

    }
    async iniciarGravacao(obj:any):Promise<any>{
        // Or to get a key/value pair
        let token = await this.getFromStorageAsync('ACCESS_TOKEN');
        let userId = await this.getFromStorageAsync('UserId');
        
        let _headers = {
            Authorization: "Bearer " + token
        };
        
        let url = `${this.AUTH_SERVER_ADDRESS}/v1/iniciargravacao`;

        return this.httpClient.post<Retorno>(url,obj,  { headers: _headers}).toPromise();

    }
    async iniciarPercurso(obj:any):Promise<any>{
        // Or to get a key/value pair
        let token = await this.getFromStorageAsync('ACCESS_TOKEN');
        let userId = await this.getFromStorageAsync('UserId');
        
        let _headers = {
            Authorization: "Bearer " + token
        };
        
        let url = `${this.AUTH_SERVER_ADDRESS}/v1/iniciarpercurso`;

        return this.httpClient.post<Retorno>(url,obj,  { headers: _headers}).toPromise();

    }
    async dadosPercurso(obj:any):Promise<any>{
        // Or to get a key/value pair
        let token = await this.getFromStorageAsync('ACCESS_TOKEN');
        let userId = await this.getFromStorageAsync('UserId');
        
        let _headers = {
            Authorization: "Bearer " + token
        };
        
        let url = `${this.AUTH_SERVER_ADDRESS}/v1/dadospercurso`;

        return this.httpClient.post<Retorno>(url,obj,  { headers: _headers}).toPromise();

    }
    async finalizarPercurso(obj:any):Promise<any>{
        // Or to get a key/value pair
        let token = await this.getFromStorageAsync('ACCESS_TOKEN');
        let userId = await this.getFromStorageAsync('UserId');
        
        let _headers = {
            Authorization: "Bearer " + token
        };
        
        let url = `${this.AUTH_SERVER_ADDRESS}/v1/finalizarpercurso`;

        return this.httpClient.post<Retorno>(url,obj,  { headers: _headers}).toPromise();

    }
    async removerPercurso(obj:any):Promise<any>{
        // Or to get a key/value pair
        let token = await this.getFromStorageAsync('ACCESS_TOKEN');
        let userId = await this.getFromStorageAsync('UserId');
        
        let _headers = {
            Authorization: "Bearer " + token
        };
        
        let url = `${this.AUTH_SERVER_ADDRESS}/v1/removerpercurso`;

        return this.httpClient.post<Retorno>(url,obj,  { headers: _headers}).toPromise();

    }
    async getMeusDados():Promise<User>{
        // Or to get a key/value pair
        let token = await this.getFromStorageAsync('ACCESS_TOKEN');
        let userId = await this.getFromStorageAsync('UserId');
        
        let _headers = {
            Authorization: "Bearer " + token
        };
        
        let url = `${this.AUTH_SERVER_ADDRESS}/v1/cadastro/${userId}`;

        return this.httpClient.get<User>(url, { headers: _headers}).toPromise();

        //console.log(dados);
        
    }
    
    async getAlertasTipo():Promise<any[]>{
        // Or to get a key/value pair
        let token = await this.getFromStorageAsync('ACCESS_TOKEN');
        let userId = await this.getFromStorageAsync('UserId');
        
        let _headers = {
            Authorization: "Bearer " + token
        };
        
        let url = `${this.AUTH_SERVER_ADDRESS}/v1/tipoalerta`;

        return this.httpClient.get<any[]>(url, { headers: _headers}).toPromise();
        
    }
    async getAlertas(lat:any, lng:any):Promise<any[]>{
        // Or to get a key/value pair
        let token = await this.getFromStorageAsync('ACCESS_TOKEN');
        let userId = await this.getFromStorageAsync('UserId');
        
        let _headers = {
            Authorization: "Bearer " + token
        };
        
        let url = `${this.AUTH_SERVER_ADDRESS}/v1/alerta?lat=${lat}&lng=${lng}`;

        return this.httpClient.get<any[]>(url, { headers: _headers}).toPromise();
        
    }
    async getMeusAlertas():Promise<any[]>{
        // Or to get a key/value pair
        let token = await this.getFromStorageAsync('ACCESS_TOKEN');
        let userId = await this.getFromStorageAsync('UserId');
        
        let _headers = {
            Authorization: "Bearer " + token
        };
        
        let url = `${this.AUTH_SERVER_ADDRESS}/v1/meusalertas`;

        return this.httpClient.get<any[]>(url, { headers: _headers}).toPromise();
        
    }
    
    async getBikes():Promise<any[]>{
        // Or to get a key/value pair
        let token = await this.getFromStorageAsync('ACCESS_TOKEN');
        let userId = await this.getFromStorageAsync('UserId');
        
        let _headers = {
            Authorization: "Bearer " + token
        };
        
        let url = `${this.AUTH_SERVER_ADDRESS}/v1/bike`;

        return this.httpClient.get<any[]>(url, { headers: _headers}).toPromise();
        
    }
    async getAtividades(obj:any):Promise<any>{
        // Or to get a key/value pair
        let token = await this.getFromStorageAsync('ACCESS_TOKEN');
        let userId = await this.getFromStorageAsync('UserId');
        
        let _headers = {
            Authorization: "Bearer " + token
        };
        
        let url = `${this.AUTH_SERVER_ADDRESS}/v1/performance`;

        return this.httpClient.post<any[]>(url,obj, { headers: _headers}).toPromise();
        
    }
    async getPerformance(obj:any):Promise<any>{
        // Or to get a key/value pair
        let token = await this.getFromStorageAsync('ACCESS_TOKEN');
        let userId = await this.getFromStorageAsync('UserId');
        
        let _headers = {
            Authorization: "Bearer " + token
        };
        
        let url = `${this.AUTH_SERVER_ADDRESS}/v1/performance`;

        return this.httpClient.post<any[]>(url,obj, { headers: _headers}).toPromise();
        
    }
    async getPerformanceGrafico(obj:any):Promise<any>{
        // Or to get a key/value pair
        let token = await this.getFromStorageAsync('ACCESS_TOKEN');
        let userId = await this.getFromStorageAsync('UserId');
        
        let _headers = {
            Authorization: "Bearer " + token
        };
        
        let url = `${this.AUTH_SERVER_ADDRESS}/v1/performancegrafico`;

        return this.httpClient.post<any[]>(url,obj, { headers: _headers}).toPromise();
        
    }
    async postAlerta(obj:any):Promise<any>{
        // Or to get a key/value pair
        let token = await this.getFromStorageAsync('ACCESS_TOKEN');
        
        let _headers = {
            Authorization: "Bearer " + token
        };
        
        let url = `${this.AUTH_SERVER_ADDRESS}/v1/alerta`;

        return this.httpClient.post<Retorno>(url,obj,  { headers: _headers}).toPromise();
        
    }

    async getCupom(cupomId):Promise<Cupom>{
        // Or to get a key/value pair
        let token = await this.getFromStorageAsync('ACCESS_TOKEN');
        let userId = await this.getFromStorageAsync('UserId');
        
        let _headers = {
            Authorization: "Bearer " + token
        };
        
        let url = `${this.AUTH_SERVER_ADDRESS}/cupom/${cupomId}`;

        return this.httpClient.get<Cupom>(url, { headers: _headers}).toPromise();
        
    }
    
    async pegarCupom(cupomId):Promise<Retorno>{
        // Or to get a key/value pair
        let token = await this.getFromStorageAsync('ACCESS_TOKEN');
        let userId = await this.getFromStorageAsync('UserId');
        
        let _headers = {
            Authorization: "Bearer " + token
        };
        
        const obj = { usuarioId:userId, cupomId: cupomId };

        let url = `${this.AUTH_SERVER_ADDRESS}/usuarios/pegarcupom`;

        return this.httpClient.post<Retorno>(url,obj,  { headers: _headers}).toPromise();
        
    }
    
    async getPinos(obj):Promise<CupomMapa[]>{
        // Or to get a key/value pair
        let token = await this.getFromStorageAsync('ACCESS_TOKEN');
        let userId = await this.getFromStorageAsync('UserId');
        
        let _headers = {
            Authorization: "Bearer " + token
        };
        
        let url = `${this.AUTH_SERVER_ADDRESS}/cupom/regiao`;

        return this.httpClient.post<CupomMapa[]>(url,obj, { headers: _headers}).toPromise();
        
    }
    
    async atualizar(user: User): Promise<User> {
        let token = await this.getFromStorageAsync('ACCESS_TOKEN');
        let userId = await this.getFromStorageAsync('UserId');

        let _headers = {
            Authorization: "Bearer " + token
        };
        
        let url = `${this.AUTH_SERVER_ADDRESS}/usuarios/${userId}`;

        return this.httpClient.put<User>(url, user, { headers: _headers}).toPromise();
    }


}
