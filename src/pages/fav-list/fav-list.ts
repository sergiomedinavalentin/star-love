import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import localforage from 'localforage';

import { BackendService } from '../../providers/backend.service';
import { UserDetailsPage } from './../userDetails';

@Component({
  selector: 'page-fav-list',
  templateUrl: 'fav-list.html'
})
export class FavListPage {

  favoriteUsers: Array<any> = [];
  peoplePromises: Array<any> = [];
  people: Array<any> = [];

  db: LocalForage;

  constructor(
    public navCtrl: NavController,
    private backendService: BackendService,
    private loadingCtrl: LoadingController) {

    this.db = localforage.createInstance({
      name: 'starlove',
      storeName: 'users',
      description : 'users favorites'
    });
  }

  ionViewWillEnter() {
    if (this.favoriteUsers.length === 0) {
      this.getContent();
    }
  }

  async getContent() {
    let loader = this.loadingCtrl.create({
      content: 'Please wait...',
      spinner: 'bubbles'
    });

    loader.present();

    await this.db.getItem('_favorites').then((favorites: Array<any>) => {
      this.favoriteUsers = favorites ? favorites : [];
    });

    await this.favoriteUsers.map(async userId => {
      this.peoplePromises.push(this.getUsers(userId));
    });

    await Promise.all(this.peoplePromises).then((result: any) => {
      result.map((user: any) => {
        user.userId = user.url.split('/')[5];
        this.people.push(user);
      });
    });

    loader.dismiss();
  }

  getUsers(userId): Promise<any> {
    return new Promise((resolve, reject) => {
      this.backendService.getResources(`people/${userId}/`).then((res: any) => {
        resolve(res);
      });
    });
  }

  goToUserDetails(userId) {
    this.navCtrl.push(UserDetailsPage, { userId: userId });
  }
}
