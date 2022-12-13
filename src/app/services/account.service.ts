import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

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
    "string"
  ],
  "imagen": "string",
  "guardado": [
    "string"
  ],
  "created_by": "string",
  "updated_by": "string"
}

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  APIC = 'http://localhost:1337/auth/local'
  

  constructor(
    private http:HttpClient
  ) { }

  getAccount(){
    return this.http.get(this.APIC)
  }

  getAccountById(id:string) {
    return this.http.get('http://localhost:1337/users/'+id)
  }

  createAccount(username:string, email:string, password:string, role:string, imagen:string){
    return this.http.post('http://localhost:1337/auth/local/register',{
      username, email, password, role, imagen
    })
  }

  updateAccount(id:string, user:User){
    return this.http.put('http://localhost:1337/users/'+id,
    user)
  }

  login(username:string, password:string){
    return this.http.post(this.APIC,{
      "identifier":username,
      "password":password
    })
  }

  logout(){
    return this.http.post('http://localhost:1337/logout',{})
  }


  verifyLogin(){
    return this.http.get('http://localhost:1337/users/me')
  }

  isFav(post){
    return this.http.get('http://localhost:1337/publicacions?users.guardado='+post)
  }
  getFav(){
    return this.http.get('http://localhost:1337/publicacions?users.guardado.id_gte=0')
  }
}


