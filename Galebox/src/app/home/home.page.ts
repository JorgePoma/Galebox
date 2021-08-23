import { Component } from '@angular/core';
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
export class HomePage {
  

  posts:any =[]
  accounts:any=[]
  guardados:any=[]
  a = true
  isAuth :boolean;
  noAuth: boolean;
  isfav :boolean;

  p:any = {
      "titulo": "",
      "descripcion": "",
      "imagen": "",
      "categoria": "",
      "estrellas": 0,
      "user": "",
  }
  usuario:any = {
    "jwt": "string",
    "user": {
      "id": "string",
      "username": "string",
      "email": "string",
      "guardado":[]
    }
  }
  user:any = {
    "id": "string",
    "username": "string",
    "email": "string",
    "guardado":[]
  }
  
  constructor(
    private postService: PostService,
    private accountService: AccountService,
    public toastController: ToastController,
    private menu: MenuController
  ) { }

  ngOnInit() {
    this.usuario = localStorage.getItem('token');
    //this.getAccountById(this.usuario.user.id);
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

  loadPost(){
    
    this.postService.getPosts().subscribe(
      (res) => {
        this.posts = res;
        console.log(this.posts)
      }, 
      (err) => console.log(err)
      );
  }

  loadAccount(){
    this.accountService.getAccount().subscribe(
      (res) => {
        this.accounts = res
      }, 
      (err) => console.log(err)
      );
  }

  ionViewWillEnter(){
    this.loadPost();
    this.isLogin();
  }

  verifyLogin(){
    this.accountService.verifyLogin()
  }

  getAccountById(id){
    this.postService.getPostById(id).subscribe(
    (res) => {
      this.usuario = res;
    },
    (err) => console.log(err)
    );
  }

  logout(){
      this.accountService.logout().subscribe(
        (res) => {
          console.log('sesion cerrada correctamente',res )
          localStorage.clear();
          //this.router.navigate(['/home'])
          window.location.assign('http://localhost:8100/home');
        },
        (err) => {
          console.log(err)
        }
      );
  }

  updateRate(id,numero){
    this.postService.getPostById(id).subscribe(
    (res) => {
      this.p = res
      console.log(this.p)
      //console.log(this.p.estrellas)
      this.p.estrellas = numero;
      this.postService.updatePost(id,this.p).subscribe(
        (res) => {
          
          this.loadPost();
        },
        (err) => console.log(err)
      );
    },
    (err) => console.log(err)
    );
  }
  isLogin(){
    if (localStorage.length > 0) {
      this.isAuth = true;
      this.noAuth = false; 
    } else{
      this.isAuth = false;
      this.noAuth = true; 
    }
  }
  

  addFav(post){
    const usu = JSON.parse(localStorage.getItem('token'));
    this.usuario = usu;
    this.user = this.usuario.user;
    this.accountService.getFav().subscribe(
      (res) => {
        this.guardados = res
        
        this.guardados.push(post);
        let result = this.guardados.filter((item,index)=>{
          return this.guardados.indexOf(item) === index;
        })
        this.user.guardado = result;
        console.log(this.user);
        this.accountService.updateAccount(this.user.id,this.user).subscribe(
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
