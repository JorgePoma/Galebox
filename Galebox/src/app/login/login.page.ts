import { Component, OnInit } from '@angular/core';
import { AccountService } from "../services/account.service";
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {

  private usuario:any = {
    "data": "",
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
          this.usuario = localStorage.setItem('token',JSON.stringify({data: this.usuario.jwt}));
          //this.router.navigate(['/home'])
          window.location.assign('/');
        },
          (err) => {//console.log(err);
          this.presentToast();}
        );
      }else{
      }
    }
  }
