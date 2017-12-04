import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, AlertController} from 'ionic-angular';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import {Database} from '../../providers/database/database';
import {Product, Category} from '../../models/models';
@IonicPage()
@Component({
    selector: 'page-report-by-category',
    templateUrl: 'report-by-category.html',
})
export class ReportByCategoryPage {
    public productForm: FormGroup; // our form model
    categorys: Array<Category>;
    products: Array<Product>;
    constructor(
        private _fb: FormBuilder,
        private database: Database,
        public navCtrl: NavController,
        public alertCtrl: AlertController,
        public navParams: NavParams) {

    }

    ngOnInit(): void {
        this.productForm = this._fb.group({
            from_date: ['',],
            to_date: ['',],
            category_id: ['',],
        });
        this.database.getCategorys('').then(categorys => this.categorys = categorys);

    }
    public save() {
        let from_date = this.productForm.controls['from_date'].value;
        let to_date = this.productForm.controls['to_date'].value;
        let category_id = this.productForm.controls['category_id'].value;
        this.database.getReportProductTxByCategory(from_date, to_date, category_id,0).then((result) => {
          this.products = result;
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
