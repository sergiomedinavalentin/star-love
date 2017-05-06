import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, LoadingController, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import localforage from 'localforage';

import { BackendService } from '../providers/backend.service';
import { ProfilePage } from '../pages/profile';
import { SearchPage } from '../pages/search';
import { FavListPage } from '../pages/fav-list';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = SearchPage;

  characters: any = [];
  selectedfilter: string = 'All';
  selectOptions: any = [];
  selectedOption: string = '';

  birthYearRange: any = {
    lower: 0,
    upper: 1000
  };

  pages: Array<{title: string, component: any}>;

  db: LocalForage;

  profilePic: string = 'lucas.jpg';

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private backendService: BackendService,
    private loadingCtrl: LoadingController,
    private events: Events) {

    this.initializeApp();

    this.db = localforage.createInstance({
      name: 'starlove',
      storeName: 'profilePic',
      description : 'profile pic selected'
    });

    this.db.getItem('_pic').then((pic: any) => {
      if (!pic) {
        this.profilePic = 'lucas.jpg';
        this.db.setItem('_pic', 'lucas.jpg');
        return;
      }

      this.profilePic = pic;
    });

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Profile', component: ProfilePage },
      { title: 'Search', component: SearchPage },
      { title: 'Favorite People', component: FavListPage }
    ];

  }

  ngAfterViewInit() {
    this.events.subscribe('profile:changeProfilePic', () => {
      setTimeout(() => {
        this.db.getItem('_pic').then((pic: any) => {
          this.profilePic = pic;
        });
      }, 500);     
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  filterAll() {
    this.selectedfilter = 'All';
    this.nav.setRoot(SearchPage);
  }

  getContent(number, field): Promise<any> {
    return new Promise((resolve, reject) => {
      this.backendService.getResources(`${field}/?page=${number}`).then((res: any) => {
        resolve(res.results);
      });
    });
  }

  async chooseFilter(filter) {
    let promises = [];
    this.selectOptions = [];
    this.selectedOption = '';
    this.selectedfilter = '';
    this.characters = [];

    let loader = this.loadingCtrl.create({
      content: 'Please wait...',
      spinner: 'bubbles'
    });

    switch (filter) {
      case 'films':

        loader.present();

        this.selectedfilter = 'Films';

        for (let i = 1; i <= 1; i ++) {
          promises.push(this.getContent(i, filter));
        }
        
        await Promise.all(promises).then((result: any) => {
          result.map((item: any) => {
            item.map((film: any) => {
              let filmId = film.url.split('/')[5];

              this.selectOptions.push({id: filmId, name: film.title});
            });
          });

          loader.dismiss();
        });

        break;

      case 'starships':

        loader.present();

        this.selectedfilter = 'Starships';

        for (let i = 1; i <= 4; i ++) {
          promises.push(this.getContent(i, filter));
        }
        
        await Promise.all(promises).then((result: any) => {
          result.map((item: any) => {
            item.map((starship: any) => {
              let starshipId = starship.url.split('/')[5];

              this.selectOptions.push({id: starshipId, name: starship.name});
            });
          });

          loader.dismiss();
        });

        break;

      case 'vehicles':

        loader.present();

        this.selectedfilter = 'Vehicles';

        for (let i = 1; i <= 4; i ++) {
          promises.push(this.getContent(i, filter));
        }
        
        await Promise.all(promises).then((result: any) => {
          result.map((item: any) => {
            item.map((vehicle: any) => {
              let vehicleId = vehicle.url.split('/')[5];

              this.selectOptions.push({id: vehicleId, name: vehicle.name});
            });
          });

          loader.dismiss();
        });

        break;

      case 'species':

        loader.present();

        this.selectedfilter = 'Species';

        for (let i = 1; i <= 4; i ++) {
          promises.push(this.getContent(i, filter));
        }
        
        await Promise.all(promises).then((result: any) => {
          result.map((item: any) => {
            item.map((specie: any) => {
              let specieId = specie.url.split('/')[5];

              this.selectOptions.push({id: specieId, name: specie.name});
            });
          });

          loader.dismiss();
        });

        break;

      case 'planets':

        loader.present();

        this.selectedfilter = 'Planets';

        for (let i = 1; i <= 7; i ++) {
          promises.push(this.getContent(i, filter));
        }
        
        await Promise.all(promises).then((result: any) => {
          result.map((item: any) => {
            item.map((planet: any) => {
              let planetId = planet.url.split('/')[5];

              this.selectOptions.push({id: planetId, name: planet.name});
            });
          });

          loader.dismiss();
        });

        break;
    }
  }

  async save(field) {
    this.characters = [];

    switch (field) {
      case 'Films':

        await this.backendService.getResources(`films/${this.selectedOption}/`).then((res: any) => {
          res.characters.map((character: any) => {
            this.characters.push(character.split('/')[5]);
          });

          this.nav.setRoot(SearchPage, {characters: this.characters, birthYearRange: this.birthYearRange});
        });

        break;

      case 'Starships':

        await this.backendService.getResources(`starships/${this.selectedOption}/`).then((res: any) => {
          res.pilots.map((pilot: any) => {
            this.characters.push(pilot.split('/')[5]);
          });

          this.nav.setRoot(SearchPage, {characters: this.characters, birthYearRange: this.birthYearRange});
        });

        break;

      case 'Vehicles':

        await this.backendService.getResources(`vehicles/${this.selectedOption}/`).then((res: any) => {
          res.pilots.map((pilot: any) => {
            this.characters.push(pilot.split('/')[5]);
          });

          this.nav.setRoot(SearchPage, {characters: this.characters, birthYearRange: this.birthYearRange});
        });

        break;

      case 'Species':

        await this.backendService.getResources(`species/${this.selectedOption}/`).then((res: any) => {
          res.people.map((user: any) => {
            this.characters.push(user.split('/')[5]);
          });

          this.nav.setRoot(SearchPage, {characters: this.characters, birthYearRange: this.birthYearRange});
        });

        break;

      case 'Planets':

        await this.backendService.getResources(`planets/${this.selectedOption}/`).then((res: any) => {
          res.residents.map((resident: any) => {
            this.characters.push(resident.split('/')[5]);
          });

          this.nav.setRoot(SearchPage, {characters: this.characters, birthYearRange: this.birthYearRange});
        });

        break;
    }
  }

  getUser(userId): Promise<any> {
    return new Promise((resolve, reject) => {
      this.backendService.getResources(`people/${userId}`).then((res: any) => {
        resolve(res);
      });
    });
  }

  cancel() {
    this.selectOptions = [];
    this.selectedOption = '';
    this.selectedfilter = 'All';
    this.characters = [];
  }
}
