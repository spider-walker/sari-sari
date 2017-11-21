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
       
    }
    ngOnInit(): void {
       this.search_products();
    }

    getItems(ev: any) {
        this.search_products();
    }
    onCancel(ev: any) {
        console.log(this.search);
    }
    go_home() {
         this.navCtrl.setRoot('HomePage');
    }

    search_products() {
        this.result_title = 'Searching.....';
        this.database.getSearchProducts(this.search).then(products => this.products  = products);
    }
    view_product(id: any) {
        this.navCtrl.push('DetailProductPage', {id: id})
    }

}
