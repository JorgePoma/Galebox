import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { PostService } from "../services/post.service";
import { UploadService } from "../services/upload.service";
import { Router, ActivatedRoute } from "@angular/router";
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.page.html',
  styleUrls: ['./post-form.page.scss'],
  providers: [ UploadService ]
})
export class PostFormPage implements OnInit {

  editing = false;
  public previsualizacion: string;
  public archivos:any = []
  public loading:boolean;

  p:any = {
    "titulo": "",
    "descripcion": "",
    "imagen": "",
    "categoria": "",
    "estrellas": 0,
    "user": ""
}

  u:any = { 
    "publications": [
      "string"
    ]
  }

  constructor(
    private sanitizer: DomSanitizer, 
    private postServices: PostService,
    private accountService:AccountService, 
    private router: Router,
    private activateRoute:ActivatedRoute,
    private uploadService:UploadService) { }
    
    

  ngOnInit() {
    this.activateRoute.paramMap.subscribe((paramMap) => {
    if (paramMap.get('postid')) {
      this.editing = true;
      this.postServices.getPostById(paramMap.get('postid')).subscribe(
        (res) => {
        this.p = res;
        });
      }
    });
  }

  captureFile(event):any{
    console.log(event.target.files);
    const archivo = event.target.files[0]
    this.extraerBase64(archivo).then((imagen:any) =>{
    this.previsualizacion= imagen.base;
    });
    this.archivos.push(archivo)
  }
  extraerBase64 = async($event: any) => new Promise((resolve, reject) =>{
    try {
      const unsafeimg = window.URL.createObjectURL($event);
      const image = this.sanitizer.bypassSecurityTrustUrl(unsafeimg);
      const reader = new FileReader();
      reader.readAsDataURL($event);
      reader.onload = () => {
        resolve({
          base: reader.result
        });
      };
      reader.onerror = error => {
        resolve({
          base: null
        });
      }
    } catch (e) {
      return null;
    }
  })
  guardarPost(titulo, descripcion, categoria){
    console.log(titulo, descripcion, categoria)
    //save image
      this.loading = true;
      const file_data = this.archivos[0];
      const data = new FormData();
      data.append('file', file_data);
      data.append('upload_preset', 'galebox');
      data.append('cloud_name', 'cuarteto-dinamico')
      this.uploadService.uploadImage(data).subscribe(
        (res) => {
          if(res){
            console.log(res);
            const user = JSON.parse(localStorage.getItem('token'))
            console.log(user.user);
            this.postServices.createPost(titulo.value, descripcion.value,res.secure_url, categoria.value,user.user).subscribe(
              (res) => {
                this.loading=false;
                console.log(res);
                this.router.navigate(['/home'])
              }, 
              (err) => console.error('error1',err)
            );
          }
        },
        (err) =>{
          console.log('error2',err);
          this.loading=false;
        }
      )
  }
  updatePost(id, titulo, descripcion, imagen, categoria){
    this.loading = true;
    const file_data = this.archivos[0];
    let img_url = "";
      const data = new FormData();
      data.append('file', file_data);
      data.append('upload_preset', 'galebox');
      data.append('cloud_name', 'cuarteto-dinamico')
      this.uploadService.uploadImage(data).subscribe(
        (res) => {
          if(res){
            console.log(res);
            img_url = res.secure_url;
            this.postServices.getPostById(id).subscribe(
              (res) => {
                this.p = res
                console.log(titulo.value)
                
                if (titulo.value != "") {
                  this.p.titulo = titulo.value;
                }
                if(descripcion.value != ""){
                  this.p.descripcion = descripcion.value;
                }
                if (imagen.value != "") {
                  this.p.imagen = img_url; 
                }
                if (categoria.value != "") {
                  this.p.categoria = categoria.value;
                }
                console.log(this.p)
                this.postServices.updatePost(id,this.p).subscribe(
                (res) => {
                  console.log(res);
                  this.loading=false;
                  this.router.navigate(['/home']);
                },
                (err) => {console.log(err)
                  this.loading=false;}
                
              );
            },
            (err) => {console.log(err)
              this.loading=false;}
            );
        }
      });
    
    }
  }