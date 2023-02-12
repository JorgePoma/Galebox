import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AccountService } from "../services/account.service";
import { UploadService } from '../services/upload.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  providers: [UploadService]
})
export class RegisterPage implements OnInit {
  public previsualizacion: string;
  public archivos: any
  public loading: boolean;
  u: any = {
    "publications": [
      "string"
    ]
  }

  constructor(
    private accountService: AccountService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private uploadService: UploadService,
    public toastController: ToastController
  ) { }

  ngOnInit() {
  }
  async errorToast() {
    const toast = await this.toastController.create({
      message: 'datos invalidos',
      duration: 1000
    });
    toast.present();
  }
  captureFile(event): any {
    const archivo = event.target.files[0]
    this.extraerBase64(archivo).then((imagen: any) => {
      this.previsualizacion = imagen.base;
    });
    this.archivos = archivo
  }
  extraerBase64 = async ($event: any) => new Promise((resolve, reject) => {
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

  guardarCuenta(username, email, password) {
    this.loading = true;
    const file_data = this.archivos;
    const data = new FormData();
    data.append('file', file_data);
    data.append('upload_preset', 'galebox');
    data.append('cloud_name', 'cuarteto-dinamico')
    this.uploadService.uploadImage(data).subscribe(
      (res) => {
        this.accountService.createAccount(username.value, email.value, password.value, res.secure_url).subscribe(
          (res) => {
            this.loading = false;
            this.router.navigate(['/login'])
          },
          (err) => {
            this.loading = false;
            this.errorToast()
          }
        );

      },
      (err) => {
        //console.log(err);
      }
    )
  }
}
