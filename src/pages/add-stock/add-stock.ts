import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, AlertController} from 'ionic-angular';
import {FormGroup, FormControl, FormBuilder} from '@angular/forms';
import {Database} from '../../providers/database/database';
import {Product} from '../../models/models';
import {ProductTx} from '../../models/models';
import moment from 'moment';
@IonicPage()
@Component({
    selector: 'page-add-stock',
    templateUrl: 'add-stock.html',
})
export class AddStockPage {
    public productForm: FormGroup; // our form model
    product: Product;
    productTx: ProductTx;
    id: number;
    products: Array<Product>;
    constructor(
        private _fb: FormBuilder,
        private database: Database,
        public navCtrl: NavController,
        public alertCtrl: AlertController,
        public navParams: NavParams) {
        this.database.getProducts().then(products => this.products = products);

    }
    get_item() {
        this.id = this.productForm.controls['product_id'].value;
        if (this.id == undefined) {
            return;
        }
        console.log(this.id)
        for (let item of this.products) {
            if (item.id == this.id) {
                this.product = item;
                console.log(this.product);
                (<FormControl> this.productForm.controls['market_price']).setValue(this.product.market_price, {onlySelf: true});

            }
        }
    }
    ngOnInit(): void {
        this.productForm = this._fb.group({
            product_id: ['',],
            market_price: ['',],
            tx_date: ['',],
            quantity_added: ['1',],
        });
        this.id = this.navParams.get('id');
        (<FormControl> this.productForm.controls['product_id']).setValue(this.id, {onlySelf: true});
        this.get_item()

    }

    public save() {
        var self = this;
        this.productTx = new ProductTx;
        this.productTx.quantity_added = parseInt(this.productForm.controls['quantity_added'].value);
        this.productTx.market_price = parseInt(this.productForm.controls['market_price'].value);

        this.productTx.product_price = this.product.product_price;
        this.productTx.pid = this.product.id;
        this.productTx.tx_date = moment().format('YYYY-MM-DDTHH:mmZ');
        this.productTx.tx_date = this.productForm.controls['tx_date'].value;
        this.productTx.doctype = "add";
        this.product.market_price = this.productTx.market_price;
        console.log(this.productTx.market_price)
        if (isNaN(this.productTx.quantity_added)) {
            self.showAlert("Please check", "Quantity to add  must not be zero!");
            return;
        }

        if (this.productForm.valid) {
            let a =
                this.product.quantity = this.product.quantity + this.productTx.quantity_added;
            this.database.updateProduct(this.product).then((result) => {

            }, (error) => {
                console.log("ERROR: ", error);
            });
            this.database.insertProductTx(this.productTx).then((result) => {
                let total_price = self.productTx.quantity_added * self.productTx.market_price;
                self.showAlert("Success", "Product Added: " + self.productTx.quantity_added + "<br/> Total Cost:" + total_price.toFixed(2));
                (<FormControl> this.productForm.controls['market_price']).setValue(this.product.market_price, {onlySelf: true});
                (<FormControl> this.productForm.controls['quantity_added']).setValue('0', {onlySelf: true});
                this.get_item();


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
    go_home() {
        this.navCtrl.setRoot('HomePage');
    }

}
