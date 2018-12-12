import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { EdenGarden } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { ProfilePage } from '../pages/profile/profile';
import { PingPage } from '../pages/ping/ping';
import { AuthConfig, AuthHttp } from 'angular2-jwt';
import { AuthService } from '../services/auth/auth.service';
import { Http, HttpModule } from '@angular/http';
import { Storage } from '@ionic/storage';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';

import { environment } from '../environments/environment';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { ProducePage } from '../pages/produce/produce';
import { ProduceItemPage } from '../pages/produce/view/view-produce';
import { ProduceFunctions } from '../pages/produce/functions/functions';
import { InvoicePage } from '../pages/invoice/invoice';
import { InvoiceViewPage } from '../pages/invoice/view/view-invoice';
import { InvoiceFunctions } from '../pages/invoice/functions/functions';
import { ClientPage } from '../pages/client/client';
import { ClientViewPage } from '../pages/client/view/view-client';
import { ClientFunctions } from '../pages/client/functions/functions';
import { SettingsPage } from '../pages/settings/settings';
import { ReportsPage } from '../pages/reports/reports';
import { Stripe } from '@ionic-native/stripe';

import { PdfViewerComponent } from 'ng2-pdf-viewer';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';

// import { Transfer } from '@ionic-native/transfer';
import { Base64ToGallery } from '@ionic-native/base64-to-gallery';


let storage: Storage = new Storage('localstorage');

export function getAuthHttp(http) {
  return new AuthHttp(new AuthConfig({
    globalHeaders: [{ 'Accept': 'application/json' }],
    tokenGetter: (() => storage.get('id_token'))
  }), http);
}

@NgModule({
  declarations: [
    EdenGarden,
    AboutPage,
    ContactPage,
    HomePage,
    ProfilePage,
    PingPage,
    ProducePage,
    ProduceItemPage,
    ProduceFunctions,
    InvoicePage,
    InvoiceViewPage,
    InvoiceFunctions,
    ClientPage,
    ClientViewPage,
    ClientFunctions,
    SettingsPage,
    ReportsPage,
    PdfViewerComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(EdenGarden),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    EdenGarden,
    AboutPage,
    ContactPage,
    HomePage,
    ProfilePage,
    PingPage,
    ProducePage,
    ProduceItemPage,
    ProduceFunctions,
    InvoicePage,
    InvoiceViewPage,
    InvoiceFunctions,
    ClientPage,
    ClientViewPage,
    ClientFunctions,
    SettingsPage,
    ReportsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AuthService,
    Stripe,
    /*FIREBASE_PROVIDERS, defaultFirebase({
        apiKey: "AIzaSyA3oN8hzN4gwQNHJSHVzuLa8bK8rp_7kWg",
        authDomain: "eden-gardens.firebaseapp.com",
        databaseURL: "https://eden-gardens.firebaseio.com",
        storageBucket: "",
    }),*/
    File,
    FileOpener,
    // Transfer,
    Base64ToGallery,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    {
      provide: AuthHttp,
      useClass: IonicErrorHandler,
      useFactory: getAuthHttp,
      deps: [Http]
    }
  ]
})
export class AppModule { }