import {Component, ViewChild} from '@angular/core';
import {Nav, Platform} from 'ionic-angular';
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
        public splashScreen: SplashScreen) {
        this.initializeApp();

        // used for an example of ngFor and navigation
        this.pages = [
            {title: 'Home', component: 'HomePage'},
            {title: 'Add', component: 'AddProductPage'},
            {title: 'Sell', component: 'SellProductPage'},
            {title: 'Update', component: 'ListProductPage'},
            {title: 'Inventory List', component: 'ListProductPage'},
            {title: 'Critical Products', component: 'CriticalProductPage'},
            {title: 'About', component: 'AboutPage'}
        ];

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
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        this.nav.setRoot(page.component);
    }
}
