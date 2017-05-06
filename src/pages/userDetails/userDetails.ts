import { Component } from '@angular/core';
import { LoadingController, NavParams } from 'ionic-angular';

import { BackendService } from '../../providers/backend.service';
import localforage from 'localforage';

@Component({
  selector: 'page-userDetails',
  templateUrl: 'userDetails.html'
})
export class UserDetailsPage {

	db: LocalForage;
  userId: string = '';
  user: any = {};
  films: any = [];
  species: any = [];
  starships: any = [];
  vehicles: any = [];
  
  constructor(
  	private backendService: BackendService,
  	private loadingCtrl: LoadingController,
  	private navParams: NavParams) {

  	this.db = localforage.createInstance({
      name: 'starlove',
      storeName: 'users',
      description : 'users favorites'
    });

    this.userId = this.navParams.get('userId');
  }

  ionViewWillEnter() {
    let loader = this.loadingCtrl.create({
      content: 'Please wait...',
      spinner: 'bubbles'
    });

    loader.present();

    this.backendService.getResources(`people/${this.userId}/`).then((res: any) => {
      this.user = res;

      this.getFilm();
      this.getSpecies();
      this.getStarships();
      this.getVehicles();

      loader.dismiss();

    });
  }

  async getFilm() {
    let promises = [];

    await this.user.films.map((film: any) => {
      let filmId = film.split('/')[5];

      promises.push(this.getContent('films', filmId));
    });

    await Promise.all(promises).then((result: any) => {
      result.map((item: any) => {
        this.films.push(item.title)
      });
    }); 
  }

  async getSpecies() {
    let promises = [];

    await this.user.species.map((specie: any) => {
      let specieId = specie.split('/')[5];

      promises.push(this.getContent('species', specieId));
    });

    await Promise.all(promises).then((result: any) => {
      result.map((item: any) => {
        this.species.push(item.name)
      });
    }); 
  }

  async getStarships() {
    let promises = [];

    await this.user.starships.map((starship: any) => {
      let starshipId = starship.split('/')[5];

      promises.push(this.getContent('starships', starshipId));
    });

    await Promise.all(promises).then((result: any) => {
      result.map((item: any) => {
        this.starships.push(item.name)
      });
    }); 
  }

  async getVehicles() {
    let promises = [];

    await this.user.vehicles.map((vehicle: any) => {
      let vehicleId = vehicle.split('/')[5];

      promises.push(this.getContent('vehicles', vehicleId));
    });

    await Promise.all(promises).then((result: any) => {
      result.map((item: any) => {
        this.vehicles.push(item.name)
      });
    }); 
  }

  getContent(field, itemId): Promise<any> {
    return new Promise((resolve, reject) => {
      this.backendService.getResources(`${field}/${itemId}/`).then((res: any) => {
        resolve(res);
      });
    });
  }

}
