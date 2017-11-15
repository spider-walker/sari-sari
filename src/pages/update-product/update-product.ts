import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';

import {Database} from '../../providers/database/database';
import {Product} from '../../models/models';

@IonicPage()
@Component({
    selector: 'page-update-product',
    templateUrl: 'update-product.html',
})
export class UpdateProductPage {
    products: Array<Product>;
    result_title: string;
    search: string;
    constructor(
        public navCtrl: NavController,
        private database: Database,
        public navParams: NavParams) {
        this.search_products();
    }

    getItems(ev: any) {
        this.search_products();
    }
    onCancel(ev: any) {
        console.log(this.search);
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
    edit(id:any) {
        this.navCtrl.push('EditProductPage', {id: id,source_page:'UpdateProductPage'})
    }
 go_home() {
         this.navCtrl.setRoot('HomePage');
    }
}
