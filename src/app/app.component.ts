import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthService } from '../services/auth/auth.service';

import {HomePage} from '../pages/home/home';
import {ContactPage} from '../pages/contact/contact';
import {ProducePage} from '../pages/produce/produce';
import {InvoicePage} from '../pages/invoice/invoice';
import {ClientPage} from '../pages/client/client';
import {AboutPage} from '../pages/about/about';
import {SettingsPage} from '../pages/settings/settings';
import {ReportsPage} from '../pages/reports/reports';

@Component({
  templateUrl: 'app.html'
})
export class EdenGarden {
    @ViewChild(Nav) nav: Nav;
    activePage:any;
    rootPage: any = HomePage;

    pages: Array<{title: string, component: any, icon: string, submenu: any}>

    constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, private auth: AuthService) {
        if(!auth.authenticated()){
            //auth.login();
        }
        this.initializeApp();

        this.pages = [
            {title: 'Home', component: HomePage , icon: 'ios-home', submenu: []},
            {title: 'Produce', component: ProducePage , icon: 'ios-leaf', submenu: []},
            {title: 'Client', component: ClientPage , icon: 'ios-person', submenu: []},
            {title: 'Invoice', component: InvoicePage , icon: 'ios-cart', submenu: []},
            {title: 'Reports', component: ReportsPage , icon: 'ios-pie', submenu: []},
            {title: 'About', component: AboutPage, icon: 'ios-information-circle', submenu: []},
            {title: 'Settings', component: SettingsPage, icon: 'ios-settings', submenu: [{title: 'title',component: AboutPage, icon: 'ios-leaf'}]}
        ]
    }

    initializeApp() {
        this.platform.ready().then(() => {
          // Okay, so the platform is ready and our plugins are available.
          // Here you can do any higher level native things you might need.
          this.statusBar.styleDefault();
          this.splashScreen.hide();
        });
    }

    openPage(page){
        this.nav.setRoot(page.component);
        this.activePage = page;
    }

    gotoHome(){
        this.nav.setRoot(HomePage);
        this.activePage = false;
    }

    checkActive(page){
        return page == this.activePage;
    }

    signOut(){
        this.auth.logout();
        this.auth.login();
    }
}
