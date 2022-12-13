import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AccountService } from "../services/account.service";
import { UploadService } from '../services/upload.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  providers: [ UploadService ]
})
export class RegisterPage implements OnInit {
  public previsualizacion: string;
  public archivos:any = []
  role: string = "Authorized"
  u:any = { 
    "publications": [
      "string"
    ]
  }

  constructor(
    private accountService: AccountService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private uploadService:UploadService
  ) { }

  ngOnInit() {
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

  guardarCuenta(username, email, password){
    const file_data = this.archivos[0];
      const data = new FormData();
      data.append('file', file_data);
      data.append('upload_preset', 'galebox');
      data.append('cloud_name', 'cuarteto-dinamico')
      this.uploadService.uploadImage(data).subscribe(
        (res) => {
          if(res){
            console.log(res);
            this.accountService.createAccount(username.value, email.value, password.value, this.role, res.secure_url).subscribe(
              (res) => {
                console.log(res);
                this.router.navigate(['/login'])
              }, 
              (err) => console.error(err)
            );
          }
        },
        (err) =>{
          console.log(err);
        }
      )
  }
}
