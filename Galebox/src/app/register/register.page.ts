import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AccountService } from "../services/account.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  public previsualizacion: string;
  public archivos:any = []
  role: string = "Authorized"

  constructor(
    private accountService: AccountService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
  }
  captureFile(event):any{
    const archivo = event.target.files[0]
    this.extraerBase64(archivo).then((imagen:any) =>{
    this.previsualizacion= imagen.base;
    });
    //lllthis.archivos.push(archivo)
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
    const imagen = new FormData();
    try {
      this.archivos.forEach(archivo => {
        imagen.append('imagen',archivo)
      });
    } catch (e) {
      console.log('Error: ',e)
    }
    this.accountService.createAccount(username.value, email.value, password.value, this.role, imagen).subscribe(
      (res) => {
        this.router.navigate(['/login'])
        console.log(res)
      }, 
      (err) => console.error(err)
    );
  }
}
