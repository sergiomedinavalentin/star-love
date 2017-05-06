import { Component } from '@angular/core';
import { LoadingController, NavParams, NavController } from 'ionic-angular';

import { BackendService } from '../../providers/backend.service';
import localforage from 'localforage';
import { UserDetailsPage } from '../userDetails';

@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {

	people: any = [];
	userFav: any = [];
	userNoFav: any = [];
	characters: any = [];

  birthYearRange: any;

	db: LocalForage;

  constructor(
  	private backendService: BackendService,
  	private loadingCtrl: LoadingController,
    private navCtrl: NavController,
  	private navParams: NavParams) {

  	this.db = localforage.createInstance({
      name: 'starlove',
      storeName: 'users',
      description : 'users favorites'
    });

    this.characters = this.navParams.get('characters');
    this.birthYearRange = this.navParams.get('birthYearRange');
  }

  ionViewWillEnter() {
  	this.getContent();
  }

  async getContent() {
  	let loader = this.loadingCtrl.create({
      content: 'Please wait...',
      spinner: 'bubbles'
    });

    loader.present();

  	await this.db.getItem('_favorites').then((favorites: any) => {
  		this.userFav = favorites ? favorites : [];
  	});

  	await this.db.getItem('_nofavorites').then((no_favorites: any) => {
  		this.userNoFav = no_favorites ? no_favorites : [];
  	});

  	let promises = [];

  	if (this.characters) {
  		for (let i = 0; i < this.characters.length; i ++) {
	  		promises.push(this.getUsers(i, this.characters[i]));
	  	}

	  	await Promise.all(promises).then((result: any) => {
	  		result.map((item: any) => {
	  			let userId = item.url.split('/')[5];
	  			if (this.userFav.indexOf(userId) === -1 && this.userNoFav.indexOf(userId) === -1) {
  					item.userId = userId;

            if (!this.birthYearRange) {
              this.people.push(item);
            }

            const birthYear = item.birth_year.split('BBY');
            if (this.birthYearRange && (birthYear[0] === 'unknown' || (this.birthYearRange.lower <= birthYear[0] && this.birthYearRange.upper >= birthYear[0]))) {
              this.people.push(item);
            }
	  			}
	  		});
	  	});
  	} else {
	  	for (let i = 1; i <= 9; i ++) {
	  		promises.push(this.getUsers(i));
	  	}

	  	await Promise.all(promises).then((result: any) => {
	  		result.map((item: any) => {
	  			item.map((user: any) => {
	  				let userId = user.url.split('/')[5];
	  				if (this.userFav.indexOf(userId) === -1 && this.userNoFav.indexOf(userId) === -1) {
	  					user.userId = userId;

              if (!this.birthYearRange) {
                this.people.push(user);
              }

              const birthYear = user.birth_year.split('BBY');
              if (this.birthYearRange && (birthYear[0] === 'unknown' || (this.birthYearRange.lower <= birthYear[0] && this.birthYearRange.upper >= birthYear[0]))) {
                this.people.push(user);
              }
	  				}
	  			})
	  		});

	  	});
	  }

  	loader.dismiss();

  }

  getUsers(number, userId?): Promise<any> {
  	return new Promise((resolve, reject) => {
  		if (userId) {
  			this.backendService.getResources(`people/${userId}/`).then((res: any) => {
					resolve(res);
				});
  		} else {
  			this.backendService.getResources(`people/?page=${number}`).then((res: any) => {
					resolve(res.results);
				});
  		}
		});
  }

  likeUser(index) {
  	this.people[index].hideRight = true;
  	this.userFav.push(this.people[index].url.split('/')[5]);
  	this.db.setItem('_favorites', this.userFav);
  }

  dislikeUser(index) {
  	this.people[index].hideLeft = true;
  	this.userNoFav.push(this.people[index].url.split('/')[5]);
  	this.db.setItem('_nofavorites', this.userNoFav);
  }

  reload() {
    this.userNoFav = [];
    this.db.setItem('_nofavorites', this.userNoFav);

    this.getContent();
  }

  goToUserDetails(userId) {
    this.navCtrl.push(UserDetailsPage, {userId: userId});
  }

  swipeEvent(event, index) {
    //Left move
    if (event === 2) {
      this.dislikeUser(index);
    }

    //Right move
    if (event === 4) {
      this.likeUser(index);
    } 
  }

}
