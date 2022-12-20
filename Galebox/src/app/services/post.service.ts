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
    "string"
  ],
  "published_at": "string",
  "created_by": "string",
  "updated_by": "string"
}

@Injectable({
  providedIn: 'root'
})
export class PostService {

  API = 'http://localhost:1337/publicacions'

  constructor(
    private http: HttpClient
    ) { }

  getPosts() {
    return this.http.get(this.API)
  }

  getPostById(id:string) {
    return this.http.get('http://localhost:1337/publicacions/'+id)
  }

  getMyPost(user){
    return this.http.get('http://localhost:1337/publicacions?user='+user)
  }

  createPost(titulo: string, descripcion:string, imagen:string , categoria:string, user:User ) {
    return this.http.post(this.API,{
      titulo, descripcion,imagen, categoria, user
    })
  }

  

  removePostById(id: string) {
    return this.http.delete('http://localhost:1337/publicacions/'+id)
  }

  updatePost(id:string, post:Post){
    return this.http.put('http://localhost:1337/publicacions/'+id,
      post
    )
  }
}