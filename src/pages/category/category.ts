import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, AlertController} from 'ionic-angular';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import {Database} from '../../providers/database/database';
import {Category} from '../../models/models';
@IonicPage()
@Component({
  selector: 'page-category',
  templateUrl: 'category.html',
})
export class CategoryPage {
    public categoryForm: FormGroup; // our form model
    category: Category;
    constructor(
        private _fb: FormBuilder,
        private database: Database,
        public navCtrl: NavController,
        public alertCtrl: AlertController,
        public navParams: NavParams) {
    }

    ngOnInit(): void {
        this.categoryForm = this._fb.group({
            category_name: ['', [Validators.required, Validators.minLength(2)]], 
        });
    }
    ionViewDidLoad() {

    }
    public save() {
        var self = this;
        this.category = new Category;
        this.category.category_name = this.categoryForm.controls['category_name'].value; 
        if (!this.categoryForm.controls['category_name'].valid) {
            self.showAlert("Please check", "Please enter category name!");
            return;
        }
        
        if (this.categoryForm.valid) {
            this.database.insertCategory(this.category).then((result) => {
                self.showAlert("Success", "Category details have been saved: Name:" + self.category.category_name);
                (<FormControl> this.categoryForm.controls['category_name']).setValue('', {onlySelf: true});
                (<FormControl> this.categoryForm.controls['category_id']).setValue('', {onlySelf: true});


                this.navCtrl.push('DetailCategoryPage', {id: result})
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
