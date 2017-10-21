import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Database} from '../../providers/database/database';
import {Product} from '../../models/models';

@IonicPage()
@Component({
    selector: 'page-detail-product',
    templateUrl: 'detail-product.html',
})
export class DetailProductPage {
    product: Product;
    constructor(
        private database: Database,
        public navCtrl: NavController,
        public navParams: NavParams) {
        let id = navParams.get('id');

        this.database.getProductById(id).then((result) => {
            this.product = result;

        }, (error) => {
            console.log("ERROR: ", error);
        });
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad DetailProductPage');
    }
    edit() {
        this.navCtrl.push('EditProductPage', {id: this.product.id})
    }

}
