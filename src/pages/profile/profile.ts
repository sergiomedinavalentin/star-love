import { Component } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import localforage from 'localforage';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {

	imageSelected: string = 'lucas.jpg';

	db: LocalForage;

  constructor(
  	public navCtrl: NavController,
  	private events: Events) {

  	this.db = localforage.createInstance({
      name: 'starlove',
      storeName: 'profilePic',
      description : 'profile pic selected'
    });

  	this.db.getItem('_pic').then((pic: any) => {
  		this.imageSelected = pic;
    });
  }

  changeImage(image) {
  	this.imageSelected = image;
  	this.db.setItem('_pic', this.imageSelected);

  	this.events.publish('profile:changeProfilePic');
  }

}
