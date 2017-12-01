import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';

import {Database} from '../../providers/database/database';
import {Product, Category} from '../../models/models';

@IonicPage()
@Component({
    selector: 'page-category',
    templateUrl: 'category.html',
})
export class CategoryPage {
    products: Array<Product>;
    category: Array<Category>;
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

        this.database.getSearchProducts(this.search).then(
            products => {
                this.category = [];
                let p = "";
                for (let item of products) {
                    let c = {category_id: item.category_id, category_name: item.category_name, products: []};
                    if (!this.is_in_array(this.category, c)) {
                        this.category.push({category_id: item.category_id, category_name: item.category_name, products: []})
                    }
                }
                for (let item of this.category) {
                    for (let a of products) {
                        if (a.category_name == item.category_name) {
                            let c = item.products;
                            c.push(a);
                        }
                    }
                }

            }
        );

    }
    view_category(id: any) {
        this.navCtrl.push('DetailCategoryPage', {id: id})
    }

    add_category() {
        this.navCtrl.push('AddCategoryPage')
    }
    is_in_array(categories: Array<Category>, category: Category) {
        let found = false;
        for (var i = 0; i < categories.length; i++) {
            if (categories[i].category_id == category.category_id) {
                found = true;
                break;
            }
        }
        return found;
    }
    view_product(id: any) {
        this.navCtrl.push('DetailProductPage', {id: id})
    }

}
