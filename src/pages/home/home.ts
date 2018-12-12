import { Component } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';
import { AuthService } from '../../services/auth/auth.service';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import {ProducePage} from '../produce/produce';
import {InvoicePage} from '../invoice/invoice';
import {ClientPage} from '../client/client';
import {ReportsPage} from '../reports/reports';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

    private homeTiles: Array<{title: string, component: any, icon: string, background: string}>
    constructor(private nav: NavController,
    private db: AngularFireDatabase, private menuCtrl: MenuController, private auth: AuthService) {

        this.homeTiles = [
            {title: 'Client', component: ClientPage , icon: 'ios-person-add', background: 'client-background'},
            {title: 'Produce', component: ProducePage , icon: 'ios-leaf', background: 'produce-background'},
            {title: 'Invoice', component: InvoicePage , icon: 'ios-cart', background: 'invoice-background'},
            {title: 'Reports', component: ReportsPage , icon: 'ios-pie', background: 'reports-background'},
        ]
    }

    ngOnInit(){
        this.menuCtrl.enable(true);
    }

    openPage(page){
        this.nav.setRoot(page.component);
    }
}
