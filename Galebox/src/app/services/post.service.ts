import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
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

  API = 'https://backend-qc57.onrender.com/api/publicacions'

  constructor(
    private http: HttpClient
    ) { }

  getPosts() {
    return this.http.get(this.API)
  }

  getPostById(id:string) {
    return this.http.get('https://backend-qc57.onrender.com/api/publicacions/'+id)
  }

  getMyPost(user){
    return this.http.get('https://backend-qc57.onrender.com/api/publicacions?user='+user)
  }

  createPost(titulo: string, descripcion:string, imagen:string , categoria:string, user:User ) {
    return this.http.post(this.API,{
      titulo, descripcion,imagen, categoria, user
    })
  }

  removePostById(id: string) {
    return this.http.delete('https://backend-qc57.onrender.com/api/publicacions/'+id)
  }

  updatePost(id:string, post:Post){
    return this.http.put('https://backend-qc57.onrender.com/api/publicacions/'+id,
      post
    )
  }
}