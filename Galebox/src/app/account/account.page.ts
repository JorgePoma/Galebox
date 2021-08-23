import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from "../services/account.service";
import { PostService } from '../services/post.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {
  editing = false;
  public previsualizacion: string;
  public archivos:any = []
  public loading:boolean;
  u:any = {
    "jwt": "string",
    "user": {}
  }
  user:any = { 
    "username": "string",
    "email": "string",
    "publications": [
      "string"
    ],
    "imagen": "https://www.ver.bo/wp-content/uploads/2019/01/4b463f287cd814216b7e7b2e52e82687.png_1805022883.png",
  }

  constructor(
    private accountService:AccountService,
    private sanitizer: DomSanitizer, 
    private postServices: PostService, 
    private activateRoute:ActivatedRoute
  ) { }

  ngOnInit() {
    this.activateRoute.paramMap.subscribe((paramMap) => {
      if (paramMap.get('postid')) {
        this.editing = true;
        this.accountService.getAccountById(paramMap.get('postid')).subscribe(
          (res) => {
          this.user = res;
          });
        }
      });
  }

  ionViewWillEnter(){
    this.getCurrentAccount();
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

  getCurrentAccount(){
    const usu = JSON.parse(localStorage.getItem('token'));
    this.u = usu.user
    console.log(this.u)
  }

  updateAccount(id, username, email, imagen){
    this.postServices.getPostById(id).subscribe(
      (res) => {
        this.user = res
    
        this.user.username = username,
        this.user.email = email ,
        this.user.imagen = imagen
        this.accountService.updateAccount(id,this.user).subscribe(
        (res) => {
          console.log(res)
        },
        (err) => console.log(err)
      );
    },
    (err) => console.log(err)
    );
  }
}
