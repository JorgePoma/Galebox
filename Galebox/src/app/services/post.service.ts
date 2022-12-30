import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { User } from './account.service';

export interface Post {
  "titulo": "string",
  "descripcion": "string",
  "imagen": "string",
  "categoria": "",
  "estrellas": 0,
  "user": [],
  "users": [
  ],
  "published_at": "string",
  "created_by": "string",
  "updated_by": "string"
}

@Injectable({
  providedIn: 'root'
})
export class PostService {

  API = 'https://backend-qc57.onrender.com/api/publications'
  


  constructor(
    private http: HttpClient,
    ) { }

  getPosts() {
    return this.http.get(this.API+"?populate=%2A")
  }

  getPostById(id:string) {
    const usu = JSON.parse(localStorage.getItem('token'));
    const authToken = usu.jwt;
    const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', `Bearer ${authToken}`);
    return this.http.get('https://backend-qc57.onrender.com/api/publications/'+id,{ headers })
  }

  getMyPost(user){
    const usu = JSON.parse(localStorage.getItem('token'));
    const authToken = usu.jwt;
    const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', `Bearer ${authToken}`);
    return this.http.get('https://backend-qc57.onrender.com/api/publications?populate=%2A&filters[user][id][$eq]='+user,{ headers })
  }

  createPost(titulo: string, descripcion:string, imagen:string , categoria:string, user:User ) {
    const usu = JSON.parse(localStorage.getItem('token'));
    const authToken = usu.jwt;
    const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', `Bearer ${authToken}`);
    return this.http.post(this.API,{
      titulo, descripcion,imagen, categoria, user
    },{ headers }
    )
  }

  removePostById(id: string) {
    const usu = JSON.parse(localStorage.getItem('token'));
    const authToken = usu.jwt;
    const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', `Bearer ${authToken}`);
    return this.http.delete('https://backend-qc57.onrender.com/api/publications/'+id,{ headers })
  }

  updatePost(id:string, post:Post){
    const usu = JSON.parse(localStorage.getItem('token'));
    const authToken = usu.jwt;
    const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', `Bearer ${authToken}`);
    return this.http.put('https://backend-qc57.onrender.com/api/publications/'+id,
      post,{ headers }
    )
  }
}