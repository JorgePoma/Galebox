import { Component, OnInit } from '@angular/core';
import { AccountService } from "../services/account.service";
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';

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
    private router: Router
  ) { }

  ngOnInit() {
  }

  login(username, password){
      if(localStorage.length == 0){
        this.accountService.login(username.value, password.value).subscribe(
          (res) => {
          
          this.usuario = res;
          this.usuario = localStorage.setItem('token',JSON.stringify(res));
          console.log(JSON.parse(localStorage.getItem('token')));
          this.router.navigate(['/home'])
        },
          (err) => console.log(err)
        
        );
      }else{
        console.log('ya estas logueado')
      }
    }
  }
