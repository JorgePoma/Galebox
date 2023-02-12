import { Component, OnInit } from '@angular/core';
import { AccountService } from "../services/account.service";
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {
  public loading: boolean;
  private usuario:any = {
    "data": "",
  }

  constructor(
    private accountService: AccountService,
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
        this.loading = true;
        this.accountService.login(username.value, password.value).subscribe(
          (res) => {
          this.usuario = res;
          this.usuario = localStorage.setItem('token',JSON.stringify({data: this.usuario.jwt}));
          this.loading = false;
          window.location.assign('/');
        },
          (err) => {
            this.loading = false;
            this.presentToast();
          }
        );
      }
    }
  }
