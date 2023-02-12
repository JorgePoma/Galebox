import { Component, OnInit } from '@angular/core';
import { PostService } from "../services/post.service";
import { AccountService } from "../services/account.service";
import { MenuController, ToastController } from '@ionic/angular';

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
  a = true
  isAuth: boolean;
  noAuth: boolean;
  isfav: boolean;

  starts: any = [];

  res: any = {
    "data": []
  }

  p: any = {
    data: {
      estrellas: 0
    }

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
  }

  ngOnInit() {
    //this.getAccountById(this.usuario.user.id);
    const usu = JSON.parse(localStorage.getItem('token'));
    if (usu != null) {
      this.getAccountById()
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
      (err) => {
        //console.log(err)
      }
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
          if (d.attributes.categoria.toLowerCase().indexOf(query) > -1) {
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
      (err) => {//console.log(err)
      }
    );
  }

  ionViewWillEnter() {
    this.loadPost();
    this.isLogin();
  }


  getAccountById() {
    this.accountService.getAccount().subscribe(
      (res) => {
        this.user = res
        this.loadPost()
      },
      (err) => {//console.log('err Usu', err)
      }
    )
  }

  logout() {
    this.accountService.logout()
    window.location.assign('/');
  }

  updateRate(i, id, numero) {
    try {
      this.postService.getPostById(id).subscribe(
        (res) => {
          this.p.data.estrellas = numero;
          this.postService.updatePost(id, this.p).subscribe(
            (res) => {
              this.starts[i] = numero;
            },
            (err) => {//console.log(err)
            }
          );
        },
        (err) => {//console.log(err)
        }
      );
    } catch (error) {
      window.location.assign('/login');
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
    var pub: any = {
      "data": {
        "users": [
        ]
      }
    }
    this.getAccountById()
    pub.data.users.push(this.user.id)
    this.postService.updatePost(post.id, pub).subscribe((res) => {
    },
      (err) => {
        {//console.log(err)
        }
      })
  }
}