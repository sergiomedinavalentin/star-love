import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule } from '@angular/http';

import { MyApp } from './app.component';
import { ProfilePage } from '../pages/profile';
import { SearchPage } from '../pages/search';
import { UserDetailsPage } from '../pages/userDetails';
import { FavListPage } from '../pages/fav-list';
import { LocalConfig } from '../local.config';
import { BackendService } from '../providers/backend.service';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

let options = {
  mode: 'ios',
  backButtonText: '',
  iconMode: 'ios',
  modalEnter: 'modal-slide-in',
  modalLeave: 'modal-slide-out',
  pageTransition: 'ios'
};

@NgModule({
  declarations: [
    MyApp,
    ProfilePage,
    SearchPage,
    UserDetailsPage,
    FavListPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp, options),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ProfilePage,
    SearchPage,
    UserDetailsPage,
    FavListPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    LocalConfig,
    BackendService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
