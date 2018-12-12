import { Component } from '@angular/core';
import { NavController, Modal, NavParams, ViewController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Rx';
import { Client } from '../../../model/client';
import { ClientPage } from '../../client/client';

@Component({
  templateUrl: 'functions.html'
})
export class ClientFunctions {

    key: string;
    title: string;
    clientList: FirebaseListObservable<Client[]>;
    client = {
        id: '',
        name: '',
        address: '',
        email: '',
        is_active: 1,
        mobile: '',
        phone: ''
    };

    constructor(private nav: NavController, private navParams: NavParams, private fb: FormBuilder, public viewCtrl: ViewController) {
        this.title = navParams.get('title');
        this.clientList = navParams.get('clients');
        if(navParams.get('key')){
            this.client = navParams.get('client');
            this.key = navParams.get('key');
        }
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    addClientItem(){
        this.client.name = this.client.name.charAt(0).toUpperCase() + this.client.name.slice(1);
        this.clientList.push(this.client);
        this.viewCtrl.dismiss();
    }

    saveClientItem(){
        this.clientList.update(this.key, {name: this.client.name, address: this.client.address, email: this.client.email, mobile: this.client.mobile, phone: this.client.phone});
        this.viewCtrl.dismiss();
    }

}
