import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { NavController } from '@ionic/angular';
import { RoutesService } from '../services/routes.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private authService: AuthService, private routesService: RoutesService) {}

    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        try {
            await this.authService.authenticateToken();
            return true;
        } catch(error) {
            console.log(error);
            localStorage.removeItem("token");
            localStorage.removeItem("usuario");
            await this.routesService.routeRoot("login");
            return false;
        }
    }
  
}
