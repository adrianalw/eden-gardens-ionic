import {Component, OnInit, Inject} from '@angular/core';
import {NavController, Modal, MenuController} from 'ionic-angular';

@Component({
  templateUrl: 'settings.html',
})
export class SettingsPage {

    constructor(private nav: NavController,
    private menuCtrl: MenuController) {

    }

    ngOnInit(){
        this.menuCtrl.enable(true);
    }
}
