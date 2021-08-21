import { Component, OnInit } from '@angular/core';
import { PostService } from "../services/post.service";
import { AlertController } from '@ionic/angular';
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
    private alertControler: AlertController
  ) { }

  loadPost(){
    this.postService.getPosts().subscribe(
      (res) => {
        this.posts = res
      }, 
      (err) => console.log(err)
      );
  }
  ionViewWillEnter(){
    this.loadPost();
  }

  ngOnInit() {
  }

  async deletePost(id) {
    const alert = await this.alertControler.create({
      header: "Alerta",
      subHeader: "Remover esta publicación",
      message: "¿Estas seguro de eliminar esta publicación?",
      buttons:[{
        text:"Aceptar",
        handler: () => {
          console.log(id);
          this.postService.removePostById(id).subscribe(
          (res) => {
            this.loadPost();
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

  updatePost(id){
    
  }

}
