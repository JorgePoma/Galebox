import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { HomePage } from '../home/home.page';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-fav',
  templateUrl: './fav.page.html',
  styleUrls: ['./fav.page.scss'],
})
export class FavPage implements OnInit {

  guardados:any =[] 
  isSave :boolean;
  noSave: boolean;
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
    private accountService : AccountService,
    public toastController: ToastController
  ) { }

  ngOnInit() {
  }
  ionViewWillEnter(){
    this.loadFav();
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

  loadFav(){
   
    this.accountService.getFav().subscribe(
    (res) => {
      this.guardados = res
      if (this.guardados.length == 0) {
        this.presentToast();
      }
      console.log(this.guardados);
    })
  }
  removefav(id){
    this.isSave = false;
    this.noSave = true;
    const usu = JSON.parse(localStorage.getItem('token'));
    this.usuario = usu;
    this.user = this.usuario.user;
    const aux = [];
    for (let x = 0; x < this.guardados.length; x++) {
      const post = this.guardados[x];
      if (post.id != id) {
        aux.push(this.guardados[x]);
      }
      this.guardados = aux;
      this.user.guardados = this.guardados;
    }
    this.accountService.updateAccount(this.user.id, this.user).subscribe(
      (res) => {
        console.log(res)
        this.deleteToast();
      },
      (err)=> {
        console.log(err)
      }
    );
  }
}
