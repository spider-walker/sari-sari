import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, AlertController} from 'ionic-angular';
import {FormGroup, FormBuilder} from '@angular/forms';
import {Database} from '../../providers/database/database';
import {Product, Category} from '../../models/models';
@IonicPage()
@Component({
    selector: 'page-monthly-report',
    templateUrl: 'monthly-report.html',
})
export class MonthlyReportPage {
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
        this.database.getReportProductTxByMonth().then((result) => {
            console.log(result)
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
    make_date(date: string) {
        return date.substring(0, 10);
    }
    go_home() {
        this.navCtrl.setRoot('ReportsPage');
    }

}
