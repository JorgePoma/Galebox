import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Subject, Observable } from 'rxjs';
import { AccountService } from "../services/account.service";
import { UtilsService } from './utils.service';


export interface Post {
  "data": {
    "id": "string",
    "attributes": {
      "titulo": "string",
      "descripcion": "string",
      "imagen": "string",
      "categoria": "deporte",
      "estrellas": 0,
      "user": {
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
      },
      "users": {
        "data": [
          {
            "id": "string",
            "attributes": {}
          }
        ]
      }
    }
  }
}

@Injectable({
  providedIn: 'root'
})
export class PostService {

  API = 'https://backend-qc57.onrender.com/api/publications'
  post


  constructor(
    private http: HttpClient,
    private acountService: AccountService,
    private utils: UtilsService
    ) { }

  getPosts() {
    return this.http.get(this.API+"?populate=%2A")
  }

  getPostById(id:string) {
    const usu = JSON.parse(localStorage.getItem('token'));
    const authToken = usu.data;
    const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', `Bearer ${authToken}`);
    return this.http.get('https://backend-qc57.onrender.com/api/publications/'+id+'?populate=%2A',{ headers })
  }

  getMyPost(id){
    const usu = JSON.parse(localStorage.getItem('token'));
    const authToken = usu.data;
    const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', `Bearer ${authToken}`);
    return this.http.get('https://backend-qc57.onrender.com/api/publications?populate=%2A&filters[user][id][$eq]='+id,{ headers })
  }

  createPost(_titulo: string, _descripcion:string, imagen:string , _categoria:string, user:number, users:any) {
    const usu = JSON.parse(localStorage.getItem('token'));
    const authToken = usu.data;
    let titulo: string = this.utils.escapeHtml(_titulo)  
    let descripcion: string = this.utils.escapeHtml(_descripcion)
    let categoria: string = this.utils.escapeHtml(_categoria)
    const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', `Bearer ${authToken}`);
    return this.http.post('https://backend-qc57.onrender.com/api/publications',{
      'data':{titulo, descripcion,imagen, categoria,'estrellas':0, 'user': user, 'users': users}
    },{ headers }
    )
  }

  removePostById(id: string) {
    const usu = JSON.parse(localStorage.getItem('token'));
    const authToken = usu.data;
    const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', `Bearer ${authToken}`);
    return this.http.delete('https://backend-qc57.onrender.com/api/publications/'+id,{ headers })
  }

  updatePost(id:string, _post:Post){
    const usu = JSON.parse(localStorage.getItem('token'));
    const authToken = usu.data;
    const post = structuredClone(_post)
    post.data.attributes.titulo = this.utils.escapeHtml(_post.data.attributes.titulo)
    post.data.attributes.descripcion = this.utils.escapeHtml(_post.data.attributes.descripcion)
    post.data.attributes.categoria = this.utils.escapeHtml(_post.data.attributes.categoria)
    const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', `Bearer ${authToken}`);
    return this.http.put('https://backend-qc57.onrender.com/api/publications/'+id,
      post,{ headers }
    )
  }
  verifyModifyPost(id: any): Observable<boolean> {
    var user : any = {id};
    var subject = new Subject<boolean>();
    var out: boolean;
    this.acountService.getAccount().subscribe((res)=>{
      user = res
      this.getPostById(id.postid).subscribe(
        (res) => {
          this.post = res
          if (user.id === this.post.data.attributes.user.data.id) {
            out = true
            subject.next(out)
          } else {
            out = false
            subject.next(out)
          }
        })
    },)
    return subject.asObservable()
  }
}