import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

import { PostService } from './post.service';

export interface User {
  "username": "string",
  "email": "string",
  "provider": "string",
  "password": "string",
  "resetPasswordToken": "string",
  "confirmationToken": "string",
  "confirmed": false,
  "blocked": false,
  "role": "string",
  "publications": [
  ],
  "imagen": "string",
  "guardado": [
  ],
  "created_by": "string",
  "updated_by": "string"
}

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  APIC = 'https://backend-qc57.onrender.com/api/auth/local'
  post
  account
  usu = JSON.parse(localStorage.getItem('token'));
  authToken: any = this.usu.jwt;

  constructor(
    private http: HttpClient,
    private postService: PostService
  ) { }

  getAccount() {
    const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', this.authToken);
    return this.http.get(this.APIC,{ headers })
  }

  getAccountById(id: string) {
    const usu = JSON.parse(localStorage.getItem('token'));
    const authToken = usu.jwt;
    console.log(authToken)
    const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', authToken);
    return this.http.get('https://backend-qc57.onrender.com/api/users/' + id,{ headers })
  }

  createAccount(username: string, email: string, password: string, role: string, imagen: string) {
    return this.http.post('https://backend-qc57.onrender.com/api/auth/local/register', {
      username, email, password, role, imagen
    })
  }

  updateAccount(id: any, user: User) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', this.authToken);
    return this.http.put('https://backend-qc57.onrender.com/api/users/' + id,
      user,{ headers })
  }

  login(username: string, password: string) {
    return this.http.post(this.APIC, {
      "identifier": username,
      "password": password
    })
  }

  logout() {
    localStorage.clear()
  }

  verifyModifyPost(id: any): Observable<boolean> {
    var currentUser = JSON.parse(localStorage.getItem('token'));
    var subject = new Subject<boolean>();
    var out: boolean
    this.postService.getPostById(id.postid).subscribe(
      (res) => {
        this.post = res
        if (currentUser.user.id === this.post.user.id) {
          out = true
          subject.next(out)
        } else {
          out = false
          subject.next(out)
        }
      },
      (err) => {
        console.log(err)
      })
    return subject.asObservable()
  }

  verifyModifyUser(id: any) {
    var currentUser = JSON.parse(localStorage.getItem('token'));
    var aux = parseInt(id.userid)
    if (currentUser.user.id === aux) {
      return true
    }
    return false
  }
  verifyLogin() {
    const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', this.authToken);
    return this.http.get('https://backend-qc57.onrender.com/api/users/me',{ headers })
  }

  isFav(post) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', this.authToken);
    return this.http.get('https://backend-qc57.onrender.com/api/publications?users.guardado=' + post,{ headers })
  }
  getFav() {
    const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', this.authToken);
    return this.http.get('https://backend-qc57.onrender.com/api/publications?users.guardado.id_gte=0',{ headers })
  }
}


