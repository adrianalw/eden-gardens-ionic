import { Component } from '@angular/core';
import { NavController, ModalController, LoadingController, ActionSheetController, Platform } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Rx';
import { ProduceItem } from '../../model/produceItem';
import { ProduceItemPage } from '../produce/view/view-produce';
import { ProduceFunctions } from '../produce/functions/functions';

@Component({
  selector: 'page-produce',
  templateUrl: 'produce.html'
})


export class ProducePage {
    loader: any;
    produceItem = ProduceItemPage;
    searchQuery: Subject<any>;
    items: FirebaseListObservable<ProduceItem[]>;
    filteredItems:Observable<ProduceItem[]>;
    loading: boolean;

    constructor(private nav: NavController, private db: AngularFireDatabase, public modalCtrl: ModalController, public loadingCtrl: LoadingController, public actionSheetCtrl: ActionSheetController,public platform: Platform) {
        this.searchQuery = new Subject();
        this.items = this.db.list('/produce');
        this.initializeItems();
    }

    initializeItems(){
        this.presentLoading();
        this.filteredItems = this.items.map(x => x.map(x => {
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
            this.filteredItems = this.filteredItems.map(x => {
                return x.map(x => x).filter(x => {
                    if(this.loader){
                        this.loader.dismiss();
                        this.loader = null;
                    }
                    return x.description.toLowerCase().includes(val) || x.name.toLowerCase().includes(val);
                })
            });
        }
    }

    viewProduceOptions(item){
        let actionSheet = this.actionSheetCtrl.create({
        title: 'Modify Produce Item',
        buttons:
            [
                {
                  text: 'View',
                  icon: !this.platform.is('ios') ? 'open' : null,
                  handler: () => {
                    this.viewProduce(item);
                  }
                },
                {
                    text: 'Edit',
                    icon: !this.platform.is('ios') ? 'filing' : null,
                    handler: () => {
                        this.editProduce(item.$key, item);
                    }
                },
                {
                  text: 'Delete',
                  role: 'destructive',
                  icon: !this.platform.is('ios') ? 'trash' : null,
                  handler: () => {
                    this.removeProduce(item);
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

    viewProduce(item) {
        let modal = this.modalCtrl.create(ProduceItemPage, {items : this.items, item : item});
        modal.present();
    }

    addProduce(){
        let modal = this.modalCtrl.create(ProduceFunctions, {items : this.items, title: "Add"});
        modal.present();
    }

    editProduce(key: string, item){
        let modal = this.modalCtrl.create(ProduceFunctions, {key : key, item : item, items : this.items, title: "Edit"});
        modal.present();
    }

    removeProduce(item){
        this.items.remove(item);
    }

}
