import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AccountService } from '../account.service';

@Injectable({
  providedIn: 'root'
})
export class ModifyUserGuard implements CanActivate {
  constructor(private accountService: AccountService, private router :Router) {
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      var out: boolean
      if (!this.accountService.verifyModifyUser(route.params)) {
        return this.router.navigate(['/home']).then(() => false);
      }
      return true;
  }
  
}
