import { unsupported } from '@angular/compiler/src/render3/view/util';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from "../services/account.service";
import { PostService } from '../services/post.service';
import { UploadService } from '../services/upload.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
  providers: [ UploadService ]
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
    "username": "",
    "email": "",
    "publications": [
      ""
    ],
    "imagen": "",
  }

  constructor(
    private accountService:AccountService,
    private sanitizer: DomSanitizer, 
    private postServices: PostService, 
    private activateRoute:ActivatedRoute,
    private uploadService:UploadService
  ) { }

  ngOnInit() {
    this.activateRoute.paramMap.subscribe((paramMap) => {
      if (paramMap.get('accountid')) {
        this.editing = true;
        this.accountService.getAccountById(paramMap.get('accountid')).subscribe(
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
    this.accountService.getAccount().subscribe(
      (res)=>{
        console.log(res)
        this.u = res
      },
      (err)=>console.log('err Usu',err)
    )
  }

  updateAccount(id, username, email){
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
            img_url = res.secure_url;
            this.accountService.getAccountById(id).subscribe(
              (res) => {
                this.user = res
                if(username.value != ""){
                  this.user.username = username.value;
                }
                if(email.value != ""){
                  this.user.email = email.value;
                }
                if(img_url != this.user.imagen){
                  this.user.imagen = img_url;
                }
                this.accountService.updateAccount(id,this.user).subscribe(
                (res) => {
                  this.loading=false;
                },
                (err) => {console.log('err1',err)
                this.loading=false;}
              );
            },
            (err) => {console.log('err2',err)
            this.loading=false;}
            );
          }
        },
        (err)=>console.log('err3',err)
        )
      }
    }
