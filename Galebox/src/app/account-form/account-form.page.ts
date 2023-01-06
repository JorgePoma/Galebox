import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { PostService } from "../services/post.service";
import { UploadService } from "../services/upload.service";
import { Router, ActivatedRoute } from "@angular/router";
import { AccountService } from '../services/account.service';


@Component({
  selector: 'app-account-form',
  templateUrl: './account-form.page.html',
  styleUrls: ['./account-form.page.scss'],
  providers: [UploadService]
})
export class AccountFormPage implements OnInit {
  editing = false;
  public previsualizacion: string;
  public archivos: any = []
  public loading: boolean;

  u: any = {
    "jwt": "string",
    "user": { 'id': "" }
  }
  user: any = {
    "username": "",
    "email": "",
    "publications": [
      ""
    ],
    "imagen": "",
  }
  constructor(
    private sanitizer: DomSanitizer,
    private postServices: PostService,
    private accountService: AccountService,
    private router: Router,
    private activateRoute: ActivatedRoute,
    private uploadService: UploadService
  ) { }

  ngOnInit() {
    this.activateRoute.paramMap.subscribe((paramMap) => {
      if (paramMap.get('userid')) {
        this.editing = true;
        this.accountService.getAccountById(paramMap.get('userid')).subscribe(
          (res) => {
            this.user = res;
          });
      }
    });

  }
  captureFile(event): any {
    const archivo = event.target.files[0]
    this.extraerBase64(archivo).then((imagen: any) => {
      this.previsualizacion = imagen.base;
    });
    this.archivos.push(archivo)
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
  updateAccount(id, username, email, imagen) {
    this.loading = true;
    if (username.value != "") {
      this.user.username = username.value;
    }
    if (email.value != "") {
      this.user.username = username.value;
    }
    if (imagen.value != "") {
      const file_data = this.archivos[0];
      let img_url = "";
      const data = new FormData();
      data.append('file', file_data);
      data.append('upload_preset', 'galebox');
      data.append('cloud_name', 'cuarteto-dinamico')
      this.uploadService.uploadImage(data).subscribe(
        (res) => {
          if (res) {
            img_url = res.secure_url;
          }
        });
      this.user.imagen = img_url;
    }
    this.accountService.updateAccount(id, this.user).subscribe(
      (res) => {
        this.loading = false;
        this.router.navigate(['/home']);
      },
      (err) => {
        //console.log(err)
        this.loading = false;
      }
    );
  }
}