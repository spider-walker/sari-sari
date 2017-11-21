import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, AlertController} from 'ionic-angular';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import {Database} from '../../providers/database/database';
import {Product, Category} from '../../models/models';
@IonicPage()
@Component({
    selector: 'page-edit-product',
    templateUrl: 'edit-product.html',
})
export class EditProductPage {
    public productForm: FormGroup; // our form model
    product: Product;
    id: number;
    categorys: Array<Category>;
    source_page: string;
    constructor(
        private _fb: FormBuilder,
        private database: Database,
        public navCtrl: NavController,
        public alertCtrl: AlertController,
        public navParams: NavParams) {
        this.source_page = this.navParams.get('source_page');
        if (this.source_page == null) {
            this.source_page = 'DetailProductPage';
        }



    }

    ngOnInit(): void {
        this.productForm = this._fb.group({
            product_name: ['', [Validators.required, Validators.minLength(2)]],
            category_id: ['', [Validators.required, Validators.minLength(2)]],
            product_price: ['',],
            initial_stock: ['',],
            quantity: ['',],
            warning_point: ['',],
            description: ['',],
            date_created: ['',],
        });
        this.id = this.navParams.get('id');
        this.database.getCategorys().then(categorys => this.categorys = categorys);
        this.database.getProductById(this.id).then((result) => {
            this.product = result;
            (<FormControl> this.productForm.controls['product_name']).setValue(this.product.product_name, {onlySelf: true});
            (<FormControl> this.productForm.controls['category_id']).setValue(this.product.category_id, {onlySelf: true});
            (<FormControl> this.productForm.controls['product_price']).setValue(this.product.product_price, {onlySelf: true});
            (<FormControl> this.productForm.controls['initial_stock']).setValue(this.product.initial_stock, {onlySelf: true});
            (<FormControl> this.productForm.controls['quantity']).setValue(this.product.quantity, {onlySelf: true});
            (<FormControl> this.productForm.controls['warning_point']).setValue(this.product.warning_point, {onlySelf: true});
            (<FormControl> this.productForm.controls['description']).setValue(this.product.description, {onlySelf: true});


        }, (error) => {
            console.log("ERROR: ", error);
        });

    }
    public save() {
        var self = this;
        this.product.product_name = this.productForm.controls['product_name'].value;
        this.product.category_id = this.productForm.controls['category_id'].value;
        this.product.product_price = this.productForm.controls['product_price'].value;
        this.product.initial_stock = this.productForm.controls['initial_stock'].value;
        this.product.quantity = this.productForm.controls['quantity'].value;
        this.product.warning_point = this.productForm.controls['warning_point'].value;
        this.product.description = this.productForm.controls['description'].value;
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
            self.showAlert("Please check", "Product Price  must be a number!");
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
        this.database.updateProduct(this.product).then((result) => {
            self.showAlert("Success", "Product details have been saved: Name:" + self.product.product_name);
            this.navCtrl.push(this.source_page, {id: result})
        }, (error) => {
            console.log("ERROR: ", error);
        });

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
