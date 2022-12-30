import { Component, OnInit } from '@angular/core';
import { PostService } from "../services/post.service";
import { AccountService } from "../services/account.service";
import { Router } from '@angular/router';
import { MenuController, ToastController } from '@ionic/angular';
import { isPlatformServer } from '@angular/common';
import { Alert } from 'selenium-webdriver';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {


  posts: any;
  results: any;
  aux: any
  accounts: any
  guardados: any
  a = true
  isAuth: boolean;
  noAuth: boolean;
  isfav: boolean;

  starts: any = [];

  res: any = {
    "data":[]
  }

  p: any = {
    "titulo": "",
    "descripcion": "",
    "imagen": "",
    "categoria": "",
    "estrellas": 0,
  }
  usuario: any = {
    "jwt": "",
    "user": {
      "id": "",
      "username": "",
      "email": ""
    }
  }
  user: any = {
    "id": "",
    "username": "",
    "email": ""
  }

  constructor(
    private postService: PostService,
    private accountService: AccountService,
    public toastController: ToastController,
    private menu: MenuController
  ) {
    this.posts = [];
    this.results = []
    this.aux = []
    this.accounts = []
    this.guardados = []
  }

  ngOnInit() {
    //this.getAccountById(this.usuario.user.id);
    const usu = JSON.parse(localStorage.getItem('token'));
    if (usu != null) {
      this.usuario = usu;
      this.user = this.usuario.user;
      this.getAccountById(this.user.id)
    }
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
    this.starts = []
    this.postService.getPosts().subscribe(
      (res) => {
        this.res = res
        this.posts = this.res.data
        this.posts.map(po => this.starts.push(po.attributes.estrellas));

        this.results = this.posts.map(e => e.categoria);
        this.aux = [...this.posts];
      },
      (err) => console.log(err)
    );
  }
  //buscador
  handleChange(event) {
    const query = event.target.value.toLowerCase();
    if (query == "") {
      this.loadPost()
    } else {
      this.posts = []
      this.aux.map(
        d => {
          if (d.categoria.toLowerCase().indexOf(query) > -1) {
            this.posts.push(d);
          }
        }
      );
    }
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


  getAccountById(id) {
    this.accountService.getAccountById(id).subscribe(
      (res) => {
        this.user = res
      },
      (err) => console.log('err Usu', err)
    )
  }

  logout() {
    this.accountService.logout()
    window.location.assign('/');
  }

  updateRate(i, id, numero) {
    try {
      const usu = JSON.parse(localStorage.getItem('token'));
      this.usuario = usu;
      this.user = this.usuario.user;
      this.postService.getPostById(id).subscribe(
        (res) => {
          this.p = res
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
      window.location.assign('${process.env.URL_BASE}/login');
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
    this.getAccountById(this.user.id)
    //if (post.user.id != this.user.id) {
    this.accountService.getFav().subscribe(
      (res) => {
        this.guardados = res

        this.guardados.push(post);

        let result = this.guardados.filter((item, index) => {
          return this.guardados.indexOf(item) === index;
        })

        this.user.guardado = [...result];
        //this.user.guardado = this.guardados;

        this.accountService.updateAccount(this.user.id, this.user).subscribe(
          (res) => {
            this.saveToast();
          },
          (err) => {
            console.log(err)
          }
        );
      })
    //}
  }
}