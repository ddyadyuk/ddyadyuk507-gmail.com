import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {AngularFireAuth} from "@angular/fire/auth";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  isAuthenticated = false;

  constructor(private auth: AngularFireAuth) {
  }

  canActivate(
      next: ActivatedRouteSnapshot,
      state: RouterStateSnapshot): boolean {

    this.auth.currentUser.then(user => {
      if (user) {
        console.log("ALLOWED");
        this.isAuthenticated = true;
      } else {
        console.log("NOT ALLOWED");
        this.isAuthenticated = false;
      }
    });

    return this.isAuthenticated;

  }

  
}
