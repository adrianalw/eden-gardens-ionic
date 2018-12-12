import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, ViewController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { ProduceItem } from '../../../model/produceItem';
import { ProduceFunctions } from '../../produce/functions/functions';
import { ProducePage } from '../../produce/produce';
import {Observable} from 'rxjs/Rx';

@Component({
    selector: 'page-view',
    templateUrl: 'view-produce.html'
})
export class ProduceItemPage {

    loading: boolean;
    items: FirebaseListObservable<ProduceItem[]>;
    item: FirebaseListObservable<ProduceItem[]>;

    constructor(private nav: NavController, private navParams: NavParams, private db: AngularFireDatabase, public modalCtrl: ModalController, public viewCtrl: ViewController) {
        this.item = navParams.get('item');
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

}
