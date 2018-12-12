import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, ViewController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Invoice } from '../../../model/invoice';
import firebase from 'firebase';
import { AlertController } from 'ionic-angular';
import * as $ from 'jquery';
import * as pdfmake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import { Base64ToGallery } from '@ionic-native/base64-to-gallery';


declare var cordova: any;
@Component({
    templateUrl: 'view-invoice.html'
})
export class InvoiceViewPage {

    pdfUrl: string;
    tax: number = 10;
    loading: boolean;
    invoice_key: any;
    invoice_test: any;
    invoice: any;
    startDate: any;


    invoices: FirebaseListObservable<Invoice[]>;
    pdfItemsArra: any;

    pdfProductName: any;
    PdfQty: any;
    // pdfPrice: any;

    Tax: any;

    constructor(private nav: NavController, private navParams: NavParams, public modalCtrl: ModalController, public viewCtrl: ViewController, private db: AngularFireDatabase, public alertCtrl: AlertController, public file: File, public fileOpener: FileOpener, public base64ToGallery: Base64ToGallery) {
        this.invoice = navParams.get('invoice');
        this.startDate = new Date().toISOString();

        this.invoice.produce.forEach(function (item) {

            // this.pdfItemsArra = item;
            // this.pdfProduct = item.name;
            // this.PdfQty = item.qty;
            // console.log(this.pdfProduct);
            // console.log(this.PdfQty);

            // this.pdfProduct = item.name;
            // console.log(this.pdfProduct);
            // this.PdfQty = item.qty;
            // this.pdfPrice = item.price
            // console.log(item.name);
            // pdfItemsArra.push({
            //     pdfProductName: item.name
            // })
            // console.log(this.pdfProductName);
            // console.log(this.pdfItemsArra);
        });


    }

    generatePDF() {
        pdfmake.vfs = pdfFonts.pdfMake.vfs;
        var dd = {

            header: {
                margin: 25,
                columns: [
                    [
                        {
                            // // usually you would use a dataUri instead of the name for client-side printing
                            // // sampleImage.jpg however works inside playground so you can play with it
                            // image: '',
                            // width: 150,
                            columns: [
                                {
                                },
                            ]
                        },
                        'Company name here',
                    ],
                    {
                        layout: 'lightHorizontalLines',
                        alignment: 'right',
                        text: this.startDate,
                    },
                ]
            },

            content: [
                {
                    alignment: 'left',
                    margin: [0, 50, 0, 0],
                    columns: [
                        {
                            text: 'Bill To:-'
                        }
                    ]
                },
                {
                    alignment: 'right',
                    margin: [0, -10, 130, 0],
                    columns: [
                        {
                            //width:'auto',
                            text: this.invoice.user.name
                        }
                    ]
                },
                {
                    text: 'Another text', style: 'anotherStyle',
                    layout: 'lightHorizontalLines', // optional
                    table: {
                        headerRows: 2,
                        widths: ['auto', '*', '*', 'auto'],
                        body: [
                            ['Produce', 'Unit Price', 'Qty', 'Price'],
                            [this.getProductName(), this.getSubTotal(), this.getQty(), this.getSubTotal()],
                        ],
                    },
                },

                // columns: [
                // 'Left part',
                { text: ['Sub Total:', this.getSubTotal()], alignment: 'left', margin: [400, 10, 0, 0] },
                { text: ['Tax:', this.getTax()], alignment: 'left', margin: [400, 10, 0, 0] },
                { text: ['Total:', this.getGrandTotal()], alignment: 'left', margin: [400, 10, 0, 0] },
                // { text: ['Tax:', this.getTax()], margin: [80, -50, 0, 0] },
                // { text: ['Total:', this.getGrandTotal()], margin: [60, -20, 0, 0] },
                // { text: 'Right part', alignment: 'right' },
                // ]
            ],

            footer: {


            },
            styles: {
                header: {
                    fontSize: 22,
                    bold: true
                },
                anotherStyle: {
                    italics: true,
                    alignment: 'right',
                    margin: [0, 150, 0, 70],
                },
                anotherStyles: {
                    italics: true,
                    alignment: 'right',
                    margin: [0, 80, 0, 0],
                },
                anotherStyless: {
                    italics: true,
                    alignment: 'left',
                    margin: [0, 40, 0, 200],
                },
            }
        };

        // download the PDF
        pdfmake.createPdf(dd).open();
        pdfmake.createPdf(dd).download();
        pdfmake.createPdf(dd).getBase64((dataUrl) => {

        });
        pdfmake.createPdf(dd).getBlob(buffer => {
            // alert("hi");
            this.file.resolveDirectoryUrl(this.file.externalRootDirectory)
                .then(dirEntry => {
                    this.file.getFile(dirEntry, 'test1.pdf', { create: true })
                        .then(fileEntry => {

                            fileEntry.createWriter(writer => {

                                writer.onwrite = () => {
                                    this.fileOpener.open(fileEntry.toURL(), 'application/pdf')
                                        .then(res => { })
                                        .catch(err => {
                                            const alert = this.alertCtrl.create({ message: err.message, buttons: ['Ok'] });
                                            alert.present();
                                        });

                                    // cordova.plugins.imagesaver.saveImageToGallery(fileEntry.toURL(), function (result) {
                                    //     alert(result);
                                    // }, function (error) {
                                    //     alert(error);
                                    // });
                                }

                                writer.write(buffer);
                            })
                        })
                        .catch(err => {
                            // alert("error1" + err);
                            const aler = this.alertCtrl.create({ message: err, buttons: ['Ok'] });
                            aler.present();
                        });
                })
                .catch(err => {
                    // alert("error2" + err);
                    const aler = this.alertCtrl.create({ message: err, buttons: ['Ok'] });
                    aler.present();
                });

        });
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    getProductName(){
        let productName: any;
        this.invoice.produce.forEach(function (item) {
            productName = item.name;
        });
         return productName;
    }

    getQty(): number {
        let qty: number = 0;
        this.invoice.produce.forEach(function (item) {
            qty = item.qty;
        });
        return qty;
    }

    getDate(): number {
        let getdate: number = 0;
        this.invoice.produce.forEach(function (item) {
            getdate = item.date;
        });
        return getdate;
    }

    getSubTotal(): number {
        let subTotal: number = 0;
        this.invoice.produce.forEach(function (item) {
            subTotal += item.qty * item.price;
        });
        if (isNaN(subTotal)) { return 0; } else { return subTotal; };
    }

    getTax(): number {
        this.Tax = this.getSubTotal() * (this.tax / 100);
        if (isNaN(this.Tax)) { return 0; } else {
            return this.Tax.toPrecision(2);
        };
    }

    getGrandTotal(): number {
        var total = this.getSubTotal() + this.getTax();
        if (isNaN(total)) { return 0; } else { return total; };
    }

    openCheckout() {

        //alert("payment");
        var handler = (<any>window).StripeCheckout.configure({
            key: 'pk_test_PpqquEajtjVtCudw6D51O6to',
            locale: 'auto',
            token: function (token: any) {
                // alert("token"+JSON.stringify(token));
                // alert("token.id"+token.id);

                $.ajax({
                    type: "POST",
                    url: 'https://noodlio-pay.p.mashape.com/charge/token',
                    cache: false,
                    headers: {
                        'X-Mashape-Key': "EfsEuAPzKzmsho5knW9Q8CHUTpaop10rhi8jsnxurKRMOUg3Ov",
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Accept': 'application/json'
                    },
                    data: {

                        amount: 100,
                        currency: "usd",
                        description: "Your custom description here",
                        source: token.id,
                        stripe_account: "acct_1AjWLrKyBbYAVfCk",
                        test: true
                    },
                    success: function (response) {
                        this.payment = response.id;
                        alert(JSON.stringify(response));
                        // showAlert() {
                        let alerts = this.alertCtrl.create({
                            title: 'Thank You',
                            subTitle: 'Your payment was completed!',
                            buttons: ['OK']
                        });
                        alerts.present();
                        // }
                        var getKey = localStorage.getItem('paymentInvoiceKey');
                        // alert('getKey '+ getKey);

                        var starCountRef = firebase.database().ref(`/invoice/${getKey}`);
                        starCountRef.update({
                            paymentStatus: true
                        });
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        alert("some error");
                        alert("XMLHttpRequest==" + JSON.stringify(XMLHttpRequest));
                        alert("textStatus==" + textStatus);
                        alert("errorThrown==" + errorThrown);
                    }
                })
                // You can access the token ID with `token.id`.
                // Get the token ID to your server-side code for use.
            }
        });

        handler.open({
            name: 'Demo Site',
            description: '2 widgets',
        });
    }
}



// npm install -g ionic@2.2.3


// configurations.all {
//   resolutionStrategy.eachDependency { DependencyResolveDetails details ->
//     def requested = details.requested
//     if (requested.group == 'com.android.support') {
//       if (!requested.name.startsWith("multidex")) {
//         details.useVersion '25.3.1'
//       }
//     }
//   }
// }
