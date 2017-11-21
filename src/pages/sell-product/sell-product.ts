import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';

import {Database} from '../../providers/database/database';
import {Product, Category} from '../../models/models';

@IonicPage()
@Component({
    selector: 'page-sell-product',
    templateUrl: 'sell-product.html',
})
export class SellProductPage {
    products: Array<Product>;
    result_title: string;
    search: string;
    category_id: number = 0;
    categorys: Array<Category>;
    constructor(
        public navCtrl: NavController,
        private database: Database,
        public navParams: NavParams) {
        this.fetch_products();
        this.database.getCategorys().then(categorys => this.categorys = categorys);
    }

    getItems(ev: any) {
        this.search_products();
    }
    onCancel(ev: any) {
        console.log(this.search);
    }
    fetch_products() {
        this.result_title = 'Searching.....';
        this.database.getProducts().then((result) => {
            this.products = <Array<Product>> result;
            if (this.products.length > 0) {
                this.result_title = this.products.length + ' results found';
            } else {
                this.result_title = 'No results found';
            }

        }, (error) => {
            console.log("ERROR: ", error);
        });
    }
    search_products() {
        this.result_title = 'Searching.....';
        console.log(this.category_id);
        this.database.getSearchProductsByCategory(this.search, this.category_id).then((result) => {
            this.products = <Array<Product>> result;
            if (this.products.length > 0) {
                this.result_title = this.products.length + ' results found';
            } else {
                this.result_title = 'No results found';
            }

        }, (error) => {
            console.log("ERROR: ", error);
        });
    }
    view_product(id: any) {
        this.navCtrl.push('SellPage', {id: id})
    }
    go_home() {
        this.navCtrl.setRoot('HomePage');
    }
}
