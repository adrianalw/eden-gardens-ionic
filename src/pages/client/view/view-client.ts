import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, ViewController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Client } from '../../../model/client';
import { Observable } from 'rxjs/Rx';
import { ClientFunctions } from '../../client/functions/functions';
import { ClientPage } from '../../client/client';

@Component({
  templateUrl: 'view-client.html'
})
export class ClientViewPage {

    loading: boolean;
    client: FirebaseListObservable<Client[]>;
    clients: FirebaseListObservable<Client[]>;

    constructor(private nav: NavController, private navParams: NavParams, public modalCtrl: ModalController, public viewCtrl: ViewController) {
        this.client = navParams.get('client');
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

}
