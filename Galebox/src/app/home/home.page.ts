import { Component, OnInit } from '@angular/core';
import { PostService } from "../services/post.service";
import { AccountService } from "../services/account.service";
import { Router } from '@angular/router';
import { MenuController, ToastController } from '@ionic/angular';
import { isPlatformServer } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {


  posts: any;
  accounts: any
  guardados: any
  a = true
  isAuth: boolean;
  noAuth: boolean;
  isfav: boolean;

  starts: any = [];

  p: any = {
    "titulo": "",
    "descripcion": "",
    "imagen": "",
    "categoria": "",
    "estrellas": 0,
    "user": "",
  }
  usuario: any = {
    "jwt": "",
    "user": {
      "id": "",
      "username": "",
      "email": "",
      "guardado": []
    }
  }
  user: any = {
    "id": "",
    "username": "",
    "email": "",
    "guardado": []
  }

  constructor(
    private postService: PostService,
    private accountService: AccountService,
    public toastController: ToastController,
    private menu: MenuController
  ) {
    this.posts = [];
    this.accounts = []
    this.guardados = []
  }

  ngOnInit() {
    this.usuario = localStorage.getItem('token');
    //this.getAccountById(this.usuario.user.id);
    const usu = JSON.parse(localStorage.getItem('token'));
    this.usuario = usu;
    this.user = this.usuario.user;
  }

  async openCustom() {
    await this.menu.enable(true, 'custom');
    await this.menu.open('custom');
  }

  async saveToast() {
    const toast = await this.toastController.create({
      message: 'Publicacion añadida a favoritos',
      duration: 1000
    });
    toast.present();
  }

  loadPost() {

    this.postService.getPosts().subscribe(
      (res) => {
        this.posts = res;
        this.posts.map(po => this.starts.push(po.estrellas));
        console.log(this.posts)
        console.log(this.starts)
      },
      (err) => console.log(err)
    );
  }

  loadAccount() {
    this.accountService.getAccount().subscribe(
      (res) => {
        this.accounts = res
      },
      (err) => console.log(err)
    );
  }

  ionViewWillEnter() {
    this.loadPost();
    this.isLogin();
  }

  verifyLogin() {
    this.accountService.verifyLogin()
  }

  getAccountById(id) {
    this.postService.getPostById(id).subscribe(
      (res) => {
        this.usuario = res;
      },
      (err) => console.log(err)
    );
  }

  logout() {
    this.accountService.logout().subscribe(
      (res) => {
        console.log('sesion cerrada correctamente', res)
        localStorage.clear();
        //this.router.navigate(['/home'])
        window.location.assign('http://localhost:8100/home');
      },
      (err) => {
        console.log(err)
      }
    );
  }

  updateRate(i, id, numero) {
    try {
      const usu = JSON.parse(localStorage.getItem('token'));
      this.usuario = usu;
      this.user = this.usuario.user;
      this.postService.getPostById(id).subscribe(
        (res) => {
          this.p = res
          //console.log(this.p)
          //console.log(this.p.estrellas)
          this.p.estrellas = numero;
          this.postService.updatePost(id, this.p).subscribe(
            (res) => {
              this.starts[i] = numero;
              //this.loadPost();

            },
            (err) => console.log(err)
          );
        },
        (err) => console.log(err)
      );
    } catch (error) {
      window.location.assign('http://localhost:8100/login');
    }

  }
  isLogin() {
    if (localStorage.length > 0) {
      this.isAuth = true;
      this.noAuth = false;
    } else {
      this.isAuth = false;
      this.noAuth = true;
    }
  }


  addFav(post) {
    const usu = JSON.parse(localStorage.getItem('token'));
    this.usuario = usu;
    this.user = this.usuario.user;
    console.log(post.user.id+ " con "+ this.user.id)
    if (post.user.id != this.user.id) {
      this.accountService.getFav().subscribe(
        (res) => {
          this.guardados = res
          console.log("guardados")
          console.log(this.guardados)
          this.guardados.push(post);
          console.log("nuevo guardados")
          console.log(this.guardados)
          let result = this.guardados.filter((item, index) => {
            return this.guardados.indexOf(item) === index;
          })
          console.log(result)
          this.user.guardado = result;
          //this.user.guardado = this.guardados;
          console.log(this.user);
          this.accountService.updateAccount(this.user.id, this.user).subscribe(
            (res) => {
              console.log(res)
              this.saveToast();
            },
            (err) => {
              console.log(err)
            }
          );
        })
    }
  }
}