import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';

@IonicPage()
@Component({
    selector: 'page-reports',
    templateUrl: 'reports.html',
})
export class ReportsPage {
    menu_pages: Array<{title: string, component: any}>;
    constructor(public navCtrl: NavController, public navParams: NavParams) {
        this.menu_pages = [
            {title: 'By Date', component: 'ReportByDatePage'},       
            {title: 'Monthly Report', component: 'MonthlyReportPage'},
        ];
    }

    openPage(page) {
        this.navCtrl.setRoot(page.component);
    }
    go_home() {
        this.navCtrl.setRoot('HomePage');
    }
}
