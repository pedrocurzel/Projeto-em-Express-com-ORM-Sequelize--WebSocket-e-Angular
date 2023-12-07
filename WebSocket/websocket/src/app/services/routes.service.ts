import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class RoutesService {

  constructor(private navCtrl: NavController) { }

  async routeRoot(route: string) {
    await this.navCtrl.navigateRoot(route);
  }

  async routeForward(route: string) {
    await this.navCtrl.navigateForward(route);
  }

  async routeBackward(route: string) {
    await this.navCtrl.navigateBack(route);
  }
}
