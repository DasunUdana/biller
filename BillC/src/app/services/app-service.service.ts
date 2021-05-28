import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage'

@Injectable({
  providedIn: 'root'
})

export class AppServiceService {
  toastDuration: 4000;
  appStorage: any;

  constructor(public toastController: ToastController, private storage: Storage) { 
    this.initStorage();
  }

  async initStorage() {
    this.appStorage = await this.storage.create();
  }

  async showErrorMsg (msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: this.toastDuration,
      color: 'danger',
      keyboardClose: true,
      buttons: [
        {
          role: 'cancel',
          handler: () => {}
        }
      ]
    });
    toast.present();
  }

  async showSuccessMsg (msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: this.toastDuration,
      color: 'success',
      keyboardClose: true,
      buttons: [
        {
          role: 'cancel',
          handler: () => {}
        }
      ]
    });
    toast.present();
  }
}
