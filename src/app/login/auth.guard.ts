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

    if (this.auth.currentUser) {
        console.log("ALLOWED");
        this.isAuthenticated = true;
      } else {
        console.log("NOT ALLOWED");
        this.isAuthenticated = false;
      }

    return this.isAuthenticated;
  }
}
