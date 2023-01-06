import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Subject, Observable } from 'rxjs';


import { PostService } from '../post.service';

@Injectable({
  providedIn: 'root'
})
export class ModifyPostGuard implements CanActivate {
  constructor(private postService: PostService) {
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    var subject = new Subject<boolean>();
    var out: boolean
    this.postService.verifyModifyPost(route.params).subscribe((res) => {
      out = res
      subject.next(out)
    })
    return subject.asObservable()
  }
}
