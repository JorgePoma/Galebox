import { Component, OnInit } from '@angular/core';
import { AccountService } from "../services/account.service";
import { Router, RouterLink } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {

  usuario:any = {
    "jwt": "string",
    "user": {}
  }

  constructor(
    private accountService: AccountService,
    private router: Router,
    public toastController: ToastController
  ) { }

  ngOnInit() {
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Datos Incorrectos',
      duration: 2000
    });
    toast.present();
  }

  login(username, password){
      if(localStorage.length == 0){
        this.accountService.login(username.value, password.value).subscribe(
          (res) => {
          
          this.usuario = res;
          this.usuario = localStorage.setItem('token',JSON.stringify(res));
          //this.router.navigate(['/home'])
          window.location.assign('${process.env.URL_BASE}/home');
        },
          (err) => {console.log(err);
          this.presentToast();}
        );
      }else{
      }
    }
  }
