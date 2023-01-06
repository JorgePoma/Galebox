import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export interface User {
  "data": {
    "id": "string",
    "attributes": {
      "username": "string",
      "email": "user@example.com",
      "role": {},
      "publications": {},
      "imagen": "string",
      "guardados": {}
    }
  }
}

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  APIC = 'https://backend-qc57.onrender.com/api/auth/local'
  APIUser = 'https://backend-qc57.onrender.com/api/users'
  account

  constructor(
    private http: HttpClient
  ) { }

  getAccount() {
    const usu = JSON.parse(localStorage.getItem('token'));
    const authToken = usu.data;
    const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', `Bearer ${authToken}`);
    return this.http.get("https://backend-qc57.onrender.com/api/users/me",{ headers })
  }

  getAccountById(id: string) {
    const usu = JSON.parse(localStorage.getItem('token'));
    const authToken = usu.data;
    const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', `Bearer ${authToken}`);
    return this.http.get('https://backend-qc57.onrender.com/api/users/' + id,{ headers })
  }

  createAccount(username: string, email: string, password: string, imagen: string) {
    return this.http.post('https://backend-qc57.onrender.com/api/auth/local/register', {
      username, email, password, imagen
    })
  }

  updateAccount(id: any, user: User) {
    const usu = JSON.parse(localStorage.getItem('token'));
    const authToken = usu.data;
    const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', `Bearer ${authToken}`);
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

  

  verifyModifyUser(id: any): Observable<boolean> {
    var user: any = {id}
    var out : boolean
    var subject = new Subject<boolean>();
    this.getAccount().subscribe((res)=>{
      user = res
      if (parseInt(id.userid) === user.id) {
        out = true
        subject.next(out)
      } else {
        out = false
        subject.next(out)
      }
    },
    (err)=>{

    })
    return subject.asObservable()
  }
  verifyLogin() {
    const usu = JSON.parse(localStorage.getItem('token'));
    const authToken = usu.data;
    const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', `Bearer ${authToken}`);
    return this.http.get('https://backend-qc57.onrender.com/api/users/me',{ headers })
  }

  isFav(post) {
    const usu = JSON.parse(localStorage.getItem('token'));
    const authToken = usu.data;
    const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', `Bearer ${authToken}`);
    return this.http.get('https://backend-qc57.onrender.com/api/publications?users.guardado=' + post,{ headers })
  }
  getFav(id:any) {
    const usu = JSON.parse(localStorage.getItem('token'));
    const authToken = usu.data;
    const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', `Bearer ${authToken}`);
    return this.http.get('https://backend-qc57.onrender.com/api/publications?populate=%2A&filters[users][id][$eq]='+id,{ headers })
  }
}


