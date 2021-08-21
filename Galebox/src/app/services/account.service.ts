import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

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

  createAccount(username:string, email:string, password:string, role:string, imagen:FormData){
    return this.http.post('http://localhost:1337/auth/local/register',{
      username, email, password, role, imagen
    })
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
}


