import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { AccountService } from '../account.service';

@Injectable({
  providedIn: 'root'
})
export class ModifyUserGuard implements CanActivate {
  constructor(private accountService: AccountService, private router: Router) {
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    var subject = new Subject<boolean>();
    var out: boolean
    this.accountService.verifyModifyUser(route.params).subscribe((res) => {
      out = res
      out == false ? this.router.navigateByUrl('/'): subject.next(out);
    })
    return subject.asObservable()
  }
}