import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})

export class AppServiceService {
  toastDuration: 4000;
  constructor(public toastController: ToastController) { }

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
