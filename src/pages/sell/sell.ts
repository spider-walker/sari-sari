import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, AlertController} from 'ionic-angular';
import {FormGroup, FormControl, FormBuilder} from '@angular/forms';
import {Database} from '../../providers/database/database';
import {Product} from '../../models/models';
import {ProductTx} from '../../models/models';
import moment from 'moment';
@IonicPage()
@Component({
    selector: 'page-sell',
    templateUrl: 'sell.html',
})
export class SellPage {
    public productForm: FormGroup; // our form model
    product: Product;
    productTx: ProductTx;
    id: number;
    constructor(
        private _fb: FormBuilder,
        private database: Database,
        public navCtrl: NavController,
        public alertCtrl: AlertController,
        public navParams: NavParams) {


    }

    ngOnInit(): void {
        this.productForm = this._fb.group({
            product_price: ['',],
            quantity_to_sell: ['1',],
        });
        this.id = this.navParams.get('id');
        this.database.getProductById(this.id).then((result) => {
            this.product = result;
            (<FormControl> this.productForm.controls['product_price']).setValue(this.product.product_price, {onlySelf: true});

        }, (error) => {
            console.log("ERROR: ", error);
        });

    }
    public save() {
        var self = this;
        this.productTx = new ProductTx;
        this.productTx.quantity = this.productForm.controls['quantity_to_sell'].value;
        this.productTx.product_price = this.productForm.controls['product_price'].value;
        this.productTx.pid = this.product.id;
        this.productTx.tx_date = moment().format('YYYY-MM-DDTHH:mmZ');
        this.productTx.doctype = "sell";
        if (this.productTx.quantity == 0) {
            self.showAlert("Please check", "You can't sell zero amount");
            return;
        }
        if (this.productTx.product_price == 0) {
            self.showAlert("Please check", "You can't sell with zero price");
            return;
        }

        if (this.productForm.valid) {
            this.product.quantity = this.product.quantity - this.productTx.quantity;
            if (this.product.quantity<= 0) {
                self.showAlert("Please check", "You don't have enough stock to sell "+this.productTx.quantity+"!");
                return;
            }
            this.database.updateProduct(this.product).then((result) => {
            }, (error) => {
                console.log("ERROR: ", error);
            });
            this.database.insertProductTx(this.productTx).then((result) => {
                self.showAlert("Success", "Product Sold:" + self.productTx.quantity);
                (<FormControl> this.productForm.controls['product_price']).setValue(this.product.product_price, {onlySelf: true});
                (<FormControl> this.productForm.controls['quantity_to_sell']).setValue('0', {onlySelf: true});


            }, (error) => {
                console.log("ERROR: ", error);
            });

        }

    }

    public showAlert(title: string, messge: string) {
        let alert = this.alertCtrl.create({
            title: title,
            subTitle: messge,
            buttons: ['OK']
        });
        alert.present();
    }

}
