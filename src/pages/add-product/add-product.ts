import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, AlertController} from 'ionic-angular';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import {Database} from '../../providers/database/database';
import {Product, Category} from '../../models/models';
@IonicPage()
@Component({
    selector: 'page-add-product',
    templateUrl: 'add-product.html',
})
export class AddProductPage {
    public productForm: FormGroup; // our form model
    product: Product;
    categorys: Array<Category>;
    constructor(
        private _fb: FormBuilder,
        private database: Database,
        public navCtrl: NavController,
        public alertCtrl: AlertController,
        public navParams: NavParams) {
        this.database.getCategorys('').then(categorys => this.categorys = categorys);
    }

    ngOnInit(): void {
        this.productForm = this._fb.group({
            product_name: ['', [Validators.required, Validators.minLength(2)]],
            category_id: ['',],
            product_price: [0,],
            market_price: [0,],
            initial_stock: ['0',],
            quantity: ['0',],
            warning_point: ['',],
            description: ['',],
            date_created: ['',],
        });
    }
    ionViewDidLoad() {

    }
    public save() {
        var self = this;
        this.product = new Product;
        this.product.product_name = this.productForm.controls['product_name'].value;
        this.product.category_id = this.productForm.controls['category_id'].value;
        this.product.product_price = this.productForm.controls['product_price'].value;
        this.product.market_price = this.productForm.controls['market_price'].value;
        this.product.initial_stock = this.productForm.controls['initial_stock'].value;
        this.product.quantity = this.productForm.controls['quantity'].value;
        this.product.warning_point = this.productForm.controls['warning_point'].value;
        this.product.description = this.productForm.controls['description'].value;
        this.product.date_created = this.productForm.controls['date_created'].value;
        if (!this.productForm.controls['product_name'].valid) {
            self.showAlert("Please check", "Please enter product name!");
            return;
        }
        if (!this.productForm.controls['description'].valid) {
            self.showAlert("Please check", "Please enter product details!");
            return;
        }
        if (isNaN(this.product.quantity)) {
            self.showAlert("Please check", "Quantity  must be a number!");
            return;
        }
        if (isNaN(this.product.category_id)) {
            self.showAlert("Please check", "Product ID  must be a number!");
            return;
        }
        if (isNaN(this.product.product_price)) {
            self.showAlert("Please check", "Retail  Price  must be a number!");
            return;
        }
        if (isNaN(this.product.market_price)) {
            self.showAlert("Please check", "Market Price  must be a number!");
            return;
        }
        if (isNaN(this.product.initial_stock)) {
            self.showAlert("Please check", "Initial Stock  must be a number!");
            return;
        }
        if (isNaN(this.product.warning_point)) {
            self.showAlert("Please check", "Warning Point  must be a number!");
            return;
        }
        if (this.productForm.valid) {
            this.database.insertProduct(this.product).then((result) => {
                self.showAlert("Success", "Product details have been saved: Name:" + self.product.product_name);
                (<FormControl> this.productForm.controls['product_name']).setValue('', {onlySelf: true});
                (<FormControl> this.productForm.controls['category_id']).setValue('', {onlySelf: true});
                (<FormControl> this.productForm.controls['product_price']).setValue('', {onlySelf: true});
                (<FormControl> this.productForm.controls['market_price']).setValue(0, {onlySelf: true});
                (<FormControl> this.productForm.controls['initial_stock']).setValue('', {onlySelf: true});
                (<FormControl> this.productForm.controls['quantity']).setValue('0', {onlySelf: true});
                (<FormControl> this.productForm.controls['warning_point']).setValue('0', {onlySelf: true});
                (<FormControl> this.productForm.controls['description']).setValue('0', {onlySelf: true});
                this.navCtrl.push('DetailProductPage', {id: result})
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
