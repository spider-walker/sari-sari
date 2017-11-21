import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, AlertController} from 'ionic-angular';
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
        public alertCtrl: AlertController,
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
    delete_product() {
        let confirm = this.alertCtrl.create({
            title: 'Are you sure?',
            message: 'You want to remove ' + this.product.product_name + '?',
            buttons: [
                {
                    text: 'No',
                    handler: () => {
                        console.log('Disagree clicked');
                    }
                },
                {
                    text: 'Yes',
                    handler: () => {
                        this.database.delete_product(this.product.id).then((result) => {
                            console.log(result);
                            this.showAlert('Success','Deleted')
                            this.navCtrl.setRoot('ListProductPage');

                        }, (error) => {
                            console.log("ERROR: ", error);
                        });
                    }
                }
            ]
        });
        confirm.present();

    }
    public showAlert(title: string, message: string) {
        let alert = this.alertCtrl.create({
            title: title,
            subTitle: message,
            buttons: ['OK']
        });
        alert.present();
    } go_home() {
         this.navCtrl.setRoot('HomePage');
    }
    get_product_category(category_id:number){
        
    }

}
