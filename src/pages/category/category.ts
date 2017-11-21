import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';

import {Database} from '../../providers/database/database';
import {Category} from '../../models/models';

@IonicPage()
@Component({
    selector: 'page-category',
    templateUrl: 'category.html',
})
export class CategoryPage {
    categorys: Array<Category>;
    result_title: string;
    search: string;
    constructor(
        public navCtrl: NavController,
        private database: Database,
        public navParams: NavParams) {

    }
    ngOnInit(): void {
        this.search_categorys();
    }
    go_home() {
        this.navCtrl.setRoot('HomePage');
    }
    getItems(ev: any) {
        this.search_categorys();
    }
    onCancel(ev: any) {
        console.log(this.search);
    }

    search_categorys() {
        this.result_title = 'Searching.....';
        this.database.getCategorys().then(categorys => this.categorys = categorys);
    }
    view_category(id: any) {
        this.navCtrl.push('DetailCategoryPage', {id: id})
    }

    add_category() {
        this.navCtrl.push('AddCategoryPage')
    }

}
