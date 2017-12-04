import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';

@IonicPage()
@Component({
    selector: 'page-home',
    templateUrl: 'home.html',
})
export class HomePage {
    menu_pages: Array<{title: string, component: any}>;
    constructor(public navCtrl: NavController, public navParams: NavParams) {
        this.menu_pages = [
            {title: 'Category', component: 'CategoryPage'},
            {title: 'Add', component: 'AddProductPage'},
            {title: 'Sell', component: 'SellProductPage'},
            {title: 'Update', component: 'UpdateProductPage'},
            {title: 'Inventory List', component: 'ListProductPage'},
            {title: 'Critical Products', component: 'CriticalProductPage'},
            {title: 'Reports', component: 'ReportsPage'},
            {title: 'About', component: 'AboutPage'},
        ];
    }

    openPage(page) {
        this.navCtrl.setRoot(page.component);
    }
    go_home() {
        this.navCtrl.setRoot('HomePage');
    }
}
