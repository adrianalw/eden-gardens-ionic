import { Component } from '@angular/core';
import { MenuController, NavController, NavParams, ModalController, LoadingController, ActionSheetController, Platform } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Rx';
import { Client } from '../../model/client';
import { ClientViewPage } from '../client/view/view-client';
import { ClientFunctions } from '../client/functions/functions';

@Component({
  selector: 'page-client',
  templateUrl: 'client.html',
})
export class ClientPage {
    loader: any;
    searchQuery: Subject<any>;
    clients: FirebaseListObservable<Client[]>;
    filteredClients:any;

    constructor(private nav: NavController, private menuCtrl: MenuController, private db: AngularFireDatabase, public modalCtrl: ModalController, public loadingCtrl: LoadingController, public actionSheetCtrl: ActionSheetController,public platform: Platform) {
        this.searchQuery = new Subject();
        this.clients = this.db.list('/users', {
            query: {
                orderByChild: 'name'
            }
        });
        this.initializeItems();
    }

    getActivePage(){
       return this.nav.getActive();
    }

    initializeItems(){
        this.presentLoading();
        this.filteredClients = this.clients.map(x => x.map(x => {
            if(this.loader){
                this.loader.dismiss();
                this.loader = null;
            }
            return x;
        }));
        if(this.loader){
            this.loader.dismiss();
            this.loader = null;
        }
    }

    presentLoading() {
        let loader = this.loadingCtrl.create({
         content: 'Loading items..'
        });
        this.loader = loader;
        this.loader.present();
    }

    getItems(ev) {
        // Reset items back to all of the items
        this.initializeItems();

        // set val to the value of the searchbar
        let val = ev.target.value;

        // if the value is an empty string don't filter the items
        if (val && val.trim() != '') {
            this.filteredClients = this.filteredClients.map(x => {
                return x.map(x => x).filter(x => {
                    if(this.loader){
                        this.loader.dismiss();
                        this.loader = null;
                    }
                    return x.name.toLowerCase().includes(val) || x.email.toLowerCase().includes(val) || x.mobile.toLowerCase().includes(val)
                })
            });
        }
    }

    viewClientOptions(client){
        let actionSheet = this.actionSheetCtrl.create({
        title: 'Modify Client',
        buttons:
            [
                {
                  text: 'View',
                  icon: !this.platform.is('ios') ? 'open' : null,
                  handler: () => {
                    this.viewClient(client);
                  }
                },
                {
                    text: 'Edit',
                    icon: !this.platform.is('ios') ? 'filing' : null,
                    handler: () => {
                        this.editClient(client.$key, client);
                    }
                },
                {
                  text: 'Delete',
                  role: 'destructive',
                  icon: !this.platform.is('ios') ? 'trash' : null,
                  handler: () => {
                    this.removeClient(client);
                  }
                },
                {
                  text: 'Cancel',
                  role: 'cancel',
                  icon: !this.platform.is('ios') ? 'close' : null,
                  handler: () => {}
                }
            ]
        });
        actionSheet.present();
    }

    viewClient(client){
        let modal = this.modalCtrl.create(ClientViewPage, {client: client});
        modal.present();
    }

    addClient(){
        let modal = this.modalCtrl.create(ClientFunctions, {clients : this.clients, title: "Add"});
        modal.present();
    }

    removeClient(client){
        this.clients.remove(client);
    }

    editClient(key: string, client){
        let modal = this.modalCtrl.create(ClientFunctions, {key : key, client : client, clients : this.clients, title: "Edit"});
        modal.present();
    }
}
