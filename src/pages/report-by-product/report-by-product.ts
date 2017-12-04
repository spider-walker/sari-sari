import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, AlertController} from 'ionic-angular';
import {FormGroup, FormBuilder} from '@angular/forms';
import {Database} from '../../providers/database/database';
import {Product} from '../../models/models';
@IonicPage()
@Component({
  selector: 'page-report-by-product',
  templateUrl: 'report-by-product.html',
})
export class ReportByProductPage {
    public productForm: FormGroup; // our form model
    categorys: Array<Product>;
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
        this.database.getProducts().then(categorys => this.categorys = categorys);

    }
    public save() {
        let from_date = this.productForm.controls['from_date'].value;
        let to_date = this.productForm.controls['to_date'].value;
        let category_id = this.productForm.controls['category_id'].value;
        if (from_date == ''){
            this.showAlert('Please check','From date is required');
            return;
        }
        if (to_date == ''){
            this.showAlert('Please check','To date is required');
            return;
        }
        if (category_id == ''){
            this.showAlert('Please check','Product is required');
            return;
        }
        this.database.getReportProductTxByCategory(from_date, to_date, 0,category_id).then((result) => {
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
    make_date(date:string){
        return date.substring(0,10);
    }
    go_home() {
        this.navCtrl.setRoot('ReportsPage');
    }

}
