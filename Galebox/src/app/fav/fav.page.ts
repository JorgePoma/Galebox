import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { AccountService } from '../services/account.service';
import { PostService } from '../services/post.service';

@Component({
  selector: 'app-fav',
  templateUrl: './fav.page.html',
  styleUrls: ['./fav.page.scss'],
})
export class FavPage implements OnInit {

  guardados: any;
  isSave: boolean;
  noSave: boolean;
  usuario: any = {
    "jwt": "string",
    "user": {
      "id": "string",
      "username": "string",
      "email": "string",
      "guardado": []
    }

  }
  user: any = {
    "id": "",
    "username": "",
    "email": ""
  }

  constructor(
    private accountService: AccountService,
    private postService: PostService,
    public toastController: ToastController
  ) { 
    this.guardados = []
  }

  ngOnInit() {
  }
  ionViewWillEnter() {
    const usu = JSON.parse(localStorage.getItem('token'));
    if (usu != null) {
      this.getAccountById()
    }
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Aun no has añadido ninguna publicacion a favoritos',
      duration: 1000
    });
    toast.present();
  }

  async deleteToast() {
    const toast = await this.toastController.create({
      message: 'Publicacion eliminada de favoritos correctamente',
      duration: 1000
    });
    toast.present();
  }

  getAccountById() {
    this.accountService.getAccount().subscribe(
      (res) => {
        this.user = res
        this.loadFav();
      },
      (err) => {
        //console.log('err Usu', err)
      }
    )
  }

  loadFav() {
    this.accountService.getFav(this.user.id).subscribe(
      (res) => {
        let aux : any = {"data":[]}
        aux = res
        this.guardados = [...aux.data]
        if (this.guardados.length == 0) {
          this.presentToast();
        }
      })
  }
  removefav(post) {
    let u = []
    var pub: any = {
      "data": {
        "users": [
        ]
      }
    }
    this.getAccountById()
    let aux = pub.data.users.filter(u => u != post.id)
    pub.data.users = [...aux]
    this.postService.updatePost(post.id, pub).subscribe((res) => {
    },
      (err) => {
        //console.log(err)
      })
  }
}
