import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { FirebaseListObservable } from 'angularfire2/database';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Rx';
import { ProduceItem } from '../../../model/produceItem';
import { ProducePage } from '../../produce/produce';

@Component({
  templateUrl: 'functions.html'
})
export class ProduceFunctions {

    title: string;
    key: string;
    loading: boolean;
    items: FirebaseListObservable<ProduceItem[]>;
    item = {
        name: '',
        description: '',
        category: '',
        availability: '',
        finish: '',
        unit: ''
    };

    constructor(private nav: NavController, private navParams: NavParams, private fb: FormBuilder, public viewCtrl: ViewController) {
        this.title = navParams.get('title');
        this.items = navParams.get('items');
        if(navParams.get('key')){
            this.item = navParams.get('item');
            this.key = navParams.get('key');
        }
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    addProduceItem(){
        this.items.push(this.item);
        this.viewCtrl.dismiss();
    }

    saveProduceItem(){
        this.items.update(this.key, {name: this.item.name, description: this.item.description, category: this.item.category, availability: this.item.availability, finish: this.item.finish, unit: this.item.unit});
        this.viewCtrl.dismiss();
    }

}
