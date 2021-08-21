import { Component } from '@angular/core';
import { PostService } from "../services/post.service";
import { AccountService } from "../services/account.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  

  posts:any =[]
  accounts:any=[]
  a = true
  isAuth :boolean;
  noAuth: boolean;
  p:any = {
      "titulo": "",
      "descripcion": "",
      "imagen": "",
      "categoria": "",
      "estrellas": 0,
      "user": "",
  }
  
  constructor(
    private postService: PostService,
    private accountService: AccountService,
    private router: Router

  ) { }

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

  ngOnInit() {
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
    },
    (err) => console.log(err)
    );
  }

  logout(){
      this.accountService.logout().subscribe(
        (res) => {
          console.log('sesion cerrada correctamente',res )
          localStorage.clear();
          this.router.navigate(['/home'])
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
      console.log(this.p.estrellas)
      this.p.estrellas = numero;
      this.postService.updatePost(id,this.p).subscribe(
        (res) => {
          console.log(res)
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
}