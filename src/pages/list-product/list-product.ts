import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';

import {Database} from '../../providers/database/database';
import {Product} from '../../models/models';

@IonicPage()
@Component({
    selector: 'page-list-product',
    templateUrl: 'list-product.html',
})
export class ListProductPage {
    products: Array<Product>;
    result_title: string;
    search: string;
    constructor(
        public navCtrl: NavController,
        private database: Database,
        public navParams: NavParams) {
        this.fetch_products();
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
        this.database.getSearchProducts(this.search).then((result) => {
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
        this.navCtrl.push('DetailProductPage', {id: id})
    }

}
