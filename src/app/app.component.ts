import {Component, ViewChild} from '@angular/core';
import {Nav, Platform, AlertController} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {Database} from '../providers/database/database';
@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;

    rootPage: any = 'HomePage';
    pages: Array<{title: string, component: any}>;

    constructor(
        private database: Database,
        public platform: Platform,
        public statusBar: StatusBar,
        public alertCtrl: AlertController,
        public splashScreen: SplashScreen) {
        this.initializeApp();

        // used for an example of ngFor and navigation
        this.pages = [
            {title: 'Home', component: 'HomePage'},
            {title: 'Category', component: 'CategoryPage'},
            {title: 'Add', component: 'AddProductPage'},
            {title: 'Sell', component: 'SellProductPage'},
            {title: 'Update', component: 'UpdateProductPage'},
            {title: 'Inventory List', component: 'ListProductPage'},
            {title: 'Critical Products', component: 'CriticalProductPage'},
            {title: 'Reports', component: 'ReportsPage'},
            {title: 'About', component: 'AboutPage'},
        ];
        this.platform.registerBackButtonAction(() => {
            // try to dismiss any popup or modal
            console.log("Back button action called");



            // try to close the menue

            if (this.nav.canGoBack()) {
                this.nav.pop();
                return;
            } else {

                let activePage = this.nav.getActive().instance;

                let whitelistPages = ['LoginPage', 'HomePage'];

                if (whitelistPages.indexOf(activePage.constructor) < 0) {
                    this.nav.setRoot('HomePage');

                    return;
                } else if (whitelistPages.indexOf(activePage.constructor) > 0) {
                    let confirm = this.alertCtrl.create({
                        title: 'Exit?',
                        message: 'Are you want to exist the app ?',
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
                                   this.platform.exitApp();
                                }
                            }
                        ]
                    });
                    confirm.present();
                     
                } else {
                    console.error('cannot handel back button')
                }


            }

        });

    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            setTimeout(() => {
                this.splashScreen.hide();
            }, 5000);;

            this.database.opendb(2);
        });
    }

    openPage(page) {
        this.nav.setRoot(page.component);
    }


}
