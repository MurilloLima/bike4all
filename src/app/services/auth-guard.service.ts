import { Injectable } from "@angular/core";
import { Router, CanActivate, ActivatedRouteSnapshot } from "@angular/router";

import { AuthService } from '../auth/auth.service';
@Injectable({
    providedIn: "root"
})
export class AuthGuardService implements CanActivate {
    authenticated:boolean = false;


    async init() {
        this.authenticated = await this.authService.isLoggedIn();
    }

    constructor(public authService: AuthService, private router: Router) {
       this.init();
    }
    
    canActivate(route: ActivatedRouteSnapshot): boolean {
        //let authInfo = {
        //    authenticated: false
        //};
            
        this.authenticated =  this.authService.isAuthenticated();
        if (!this.authenticated) {
                
            
            this.router.navigate(["login"]);
            return false;
        }

        return true;
    }
}