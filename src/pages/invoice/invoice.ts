import { Component } from '@angular/core';
import { MenuController, NavController, NavParams, ModalController, ViewController, LoadingController, ActionSheetController, Platform } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Rx';
import { Invoice } from '../../model/invoice';
import { InvoiceViewPage } from '../invoice/view/view-invoice';
import { InvoiceFunctions } from '../invoice/functions/functions';
//<preference name="loadUrlTimeoutValue" value="60000" />

@Component({
    selector: 'page-invoice',
    templateUrl: 'invoice.html',
})
export class InvoicePage {
    loader: any;
    searchQuery: Subject<any>;
    invoices: FirebaseListObservable<Invoice[]>;
    filteredInvoices: Observable<Invoice[]>;
    loading: boolean;
    invoicePaidButton: any;

    constructor(private nav: NavController, private menuCtrl: MenuController, private db: AngularFireDatabase, public modalCtrl: ModalController, public loadingCtrl: LoadingController, public actionSheetCtrl: ActionSheetController, public platform: Platform) {
        this.searchQuery = new Subject();
        this.invoices = this.db.list('/invoice');
        console.log(this.invoices);
        this.initializeItems();
    }

    getActivePage() {
        return this.nav.getActive();
    }

    initializeItems() {
        this.presentLoading();
        this.filteredInvoices = this.invoices.map(x => x.map(x => {
            // alert("one "+ JSON.stringify(this.filteredInvoices));
            if (this.loader) {
                this.loader.dismiss();
                this.loader = null;
            }
            return x;
        }));

        if (this.loader) {
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
            this.filteredInvoices = this.filteredInvoices.map(x => {
                // alert("two "+ JSON.stringify(this.filteredInvoices));
                return x.map(x => x).filter(x => {
                    if (this.loader) {
                        this.loader.dismiss();
                        this.loader = null;
                    }
                    return x.additional_information.toLowerCase().includes(val) || x.date.toLowerCase().includes(val) || x.invoiceID.toLowerCase().includes(val)
                })
            });
        }
    }

    viewInvoiceOptions(invoice, invoiceKey) {
        //alert(invoice.paymentStatus);
        localStorage.setItem('paymentInvoiceKey', invoiceKey);

        if (invoice.paymentStatus === false) {

            let actionSheet = this.actionSheetCtrl.create({
                title: 'Modify Produce Item',
                buttons:
                [
                    {
                        text: 'View',
                        icon: !this.platform.is('ios') ? 'open' : null,
                        handler: () => {
                            this.viewInvoice(invoice.$key, invoice);
                        }
                    },
                    {
                        text: 'Edit',
                        icon: !this.platform.is('ios') ? 'filing' : null,
                        handler: () => {
                            this.editInvoice(invoice.$key, invoice);
                        }
                    },
                    {
                        text: 'Delete',
                        role: 'destructive',
                        icon: !this.platform.is('ios') ? 'trash' : null,
                        handler: () => {
                            this.removeInvoice(invoice);
                        }
                    },
                    {
                        text: 'Cancel',
                        role: 'cancel',
                        icon: !this.platform.is('ios') ? 'close' : null,
                        handler: () => { }
                    }
                ]
            });
            actionSheet.present();
        }

        else {

            this.invoicePaidButton = true;
            let actionSheet = this.actionSheetCtrl.create({
                title: 'Modify Produce Item',
                buttons:
                [
                    {
                        text: 'View',
                        icon: !this.platform.is('ios') ? 'open' : null,
                        handler: () => {
                            this.viewInvoice(invoice.$key, invoice);
                        }
                    },
                    // {
                    //     text: 'Edit',
                    //     icon: !this.platform.is('ios') ? 'filing' : null,
                    //     handler: () => {
                    //         this.editInvoice(invoice.$key, invoice);
                    //     }
                    // },
                    // {
                    //   text: 'Delete',
                    //   role: 'destructive',
                    //   icon: !this.platform.is('ios') ? 'trash' : null,
                    //   handler: () => {
                    //     this.removeInvoice(invoice);
                    //   }
                    // },
                    {
                        text: 'Cancel',
                        role: 'cancel',
                        icon: !this.platform.is('ios') ? 'close' : null,
                        handler: () => { }
                    }
                ]
            });
            actionSheet.present();

        }
    }

    viewInvoice(invoice_key, invoice) {
        let modal = this.modalCtrl.create(InvoiceViewPage, { invoice: invoice, invoice_key: invoice_key, invoices: this.invoices });
        modal.present();
    }

    addInvoice() {
        let modal = this.modalCtrl.create(InvoiceFunctions, { invoices: this.invoices, af: this.db, title: "Select Client" });
        modal.present();
    }

    editInvoice(key: string, invoice) {
        let modal = this.modalCtrl.create(InvoiceFunctions, { key: key, invoice: invoice, invoices: this.invoices, title: "Edit" });
        modal.present();
    }

    removeInvoice(invoice) {
        this.invoices.remove(invoice);
    }
}