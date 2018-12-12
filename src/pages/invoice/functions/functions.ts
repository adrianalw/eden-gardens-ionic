import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ViewController, ModalController, LoadingController, Slides, AlertController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { Invoice } from '../../../model/invoice';

import { Client } from '../../../model/client';
import { ProduceItem } from '../../../model/produceItem';

declare var cordova:any;

@Component({
  selector: 'page-invoice-functions',
  templateUrl: 'functions.html'
})
export class InvoiceFunctions{

    @ViewChild(Slides) slides: Slides;

    tax : number = 10;
    title: string;
    slideIndex: any;
    searchQuery: Subject<any>;
    filteredSelection: any;
    filteredClients: any;
    selectedClient: any;
    selectedItems: any[] = [];
    key: string;
    loader: any;
    qty: any;

    invoiceList: FirebaseListObservable<Invoice[]>;
    clients: FirebaseListObservable<Client[]>;
    produce: FirebaseListObservable<ProduceItem[]>;

    editInvoice: any;
    invoice = {
        date : new Date().toISOString(),
        additional_information : '',
        invoiceID : '',
        is_active : 1,
        paymentStatus : false,
        user : {},
        produce : <ProduceItem[]>{},
        company : ''
    };

    constructor(private nav: NavController, private navParams: NavParams, private db: AngularFireDatabase, private fb: FormBuilder, public viewCtrl: ViewController, public modalCtrl: ModalController, public loadingCtrl: LoadingController, public alertCtrl: AlertController) {

        this.title = navParams.get('title');
        this.searchQuery = new Subject();
        this.invoiceList = navParams.get('invoices');

        this.clients = this.db.list('/users');
        this.produce = this.db.list('/produce');

        if(navParams.get('key')){
            this.invoice = navParams.get('invoice');
            this.key = navParams.get('key');

            this.selectedClient = this.invoice.user;
            this.selectedItems = this.invoice.produce;
        }

        this.initializeItems(this.clients);
    }

    initializeItems(selection){
        this.presentLoading();
        this.filteredSelection = selection.map(key => key.map(item => {
            if(this.loader){
                this.loader.dismiss();
                this.loader = null;
            }
            return item;
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

    nextSlide() {
        this.slides.slideNext();
    }
    prevSlide() {
        this.slides.slidePrev();
    }
    slideChanged() {
        this.slides.lockSwipeToNext(true);
        this.slideIndex = this.slides.getActiveIndex();
        if(this.slideIndex == 0){
            this.title = 'Select Client';
            this.initializeItems(this.clients);
        }else if(this.slideIndex && this.slideIndex == 1){
            this.title = 'Select Produce';
            this.initializeItems(this.produce);
        }else{
            this.title = 'Complete Invoice';
        }
    }

    SlideInit(){
        this.slides.lockSwipeToNext(true);
    }

    slideChanging(){
        this.filteredSelection = '';
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    addInvoiceItem(){
        this.invoice['user'] = this.selectedClient;
        this.invoice['produce'] = this.selectedItems;
        this.invoiceList.push(this.invoice);
        this.viewCtrl.dismiss();
    }

    saveInvoiceItem(form){
        this.invoiceList.update(this.key, {date: form.value.date, additional_information: form.value.additional_information, produce: this.selectedItems, user: this.selectedClient});
        this.viewCtrl.dismiss();
    }

    slideToSlide(index){
        this.slides.slideTo(index);
    }

    selectClient(client){
        this.slides.lockSwipeToNext(false);

        client['id'] = client.$key;
        this.selectedClient = client;
    }

    selectItem(item){
        this.slides.lockSwipeToNext(false);
        var index = this.checkifItemExistsInArray(item);
        if(index != -1){
            this.selectedItems.splice(index, 1);
        }else{
            item['id'] = item.$key;
            this.selectedItems.push(item);
        }
    }

    checkifItemExistsInArray(item){
        var exists = this.selectedItems.map(function(single_item){
            if(single_item.id){
                return single_item.id;
            }else{
                return single_item.$key;
            }
        }).indexOf(item.$key);
        return exists;
    }

    editItem(item) {
        let prompt = this.alertCtrl.create({
            title: 'Add Info',
            message: "Enter product quantity and single produce price.",
            inputs: [
                {
                    name: 'qty',
                    placeholder: 'QTY'
                },
                {
                    name: 'price',
                    placeholder: 'Price'
                },
            ],
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel'
                },
                {
                    text: 'Save',
                    handler: data => {
                        item['qty'] = data.qty;
                        item['price'] = data.price;
                    }
                }
            ]
        });
        prompt.present();
    }
    getSubTotal() : number {
        let subTotal : number = 0;
        this.selectedItems.forEach(function (item) {
            subTotal += item.qty * item.price;
        });
        if(isNaN(subTotal)){ return 0; }else{return subTotal; };
    }

    getTax() : number {
        var tax = this.getSubTotal() * (this.tax / 100);
        if(isNaN(tax)){ return 0; }else{return tax; };
    }

    getGrandTotal() : number {
        var total = this.getSubTotal() + this.getTax();
        if(isNaN(total)){ return 0; }else{return total; };
    }

    generatePDF(){
        const before = Date.now();

        document.addEventListener('deviceready', () => {
            console.log('DEVICE READY FIRED AFTER', (Date.now() - before), 'ms');

            cordova.plugins.pdf.htmlToPDF({
                    data: "<html> <h1>  Hello World  </h1> </html>",
                    documentSize: "A4",
                    landscape: "portrait",
                    type: "base64"
                },
                (sucess) => console.log('sucess: ', sucess),
                (error) => console.log('error:', error));
        });
    }
}
