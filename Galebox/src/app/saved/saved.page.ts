import { Component, OnInit } from '@angular/core';
import { PostService } from "../services/post.service";
import { AccountService } from "../services/account.service";
import { AlertController, ToastController } from '@ionic/angular';
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-saved',
  templateUrl: './saved.page.html',
  styleUrls: ['./saved.page.scss'],
})
export class SavedPage implements OnInit {

  posts:any =[]
  res: any = {
    "data":[]
  }
  user: any = {
    "id": "",
    "username": "",
    "email": ""
  }

  constructor(
    private postService: PostService,
    private accountService: AccountService,
    private alertControler: AlertController,
    public toastController: ToastController
  ) { }

  ngOnInit() {
  }
  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Aun no has publicado nada',
      duration: 2000
    });
    toast.present();
  }

  loadMyPost(){
    
    this.postService.getMyPost(this.user.id).subscribe(
      (res) => {
        this.res = res
        this.posts = this.res.data
        if(this.posts.length == 0){
          this.presentToast();
        }
      }, 
      (err) => {
        console.log(err)
      }
      );
      
  }
  ionViewWillEnter(){
    const usu = JSON.parse(localStorage.getItem('token'));
    if (usu != null) {
      this.getAccountById()
    }
    
  }

  getAccountById() {
    this.accountService.getAccount().subscribe(
      (res) => {
        this.user = res
        this.loadMyPost();
      },
      (err) => {
        console.log('err Usu', err)
      }
    )
  }

  async deletePost(id) {
    const alert = await this.alertControler.create({
      header: "Alerta",
      subHeader: "Remover esta publicación",
      message: "¿Estas seguro de eliminar esta publicación?",
      buttons:[{
        text:"Aceptar",
        handler: () => {
          this.postService.removePostById(id).subscribe(
          (res) => {
            this.loadMyPost();
          },
          (err) => {
            console.log(err)
          }
          );
        },
      }, 
      "Cancelar",
    ],
    });
    await alert.present();
  }
}
