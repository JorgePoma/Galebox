import { Component, OnInit } from '@angular/core';
import { PostService } from "../services/post.service";
import { AlertController, ToastController } from '@ionic/angular';
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-saved',
  templateUrl: './saved.page.html',
  styleUrls: ['./saved.page.scss'],
})
export class SavedPage implements OnInit {

  posts:any =[]

  constructor(
    private postService: PostService,
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
    
    const user = JSON.parse(localStorage.getItem('token'))
    this.postService.getMyPost(user.user.id).subscribe(
      (res) => {
        this.posts = res
        if(this.posts.length == 0){
          this.presentToast();
        }
      }, 
      (err) => console.log(err)
      );
      
  }
  ionViewWillEnter(){
    this.loadMyPost();
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
          (err) => console.log(err)
          );
        },
      }, 
      "Cancelar",
    ],
    });
    await alert.present();
  }
}
