import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {IonicStorageModule} from '@ionic/storage';
import {MyApp} from './app.component';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {Database} from '../providers/database/database';
import {CustomFormsModule} from 'ng2-validation'
import {ReactiveFormsModule} from '@angular/forms';
import {MomentModule} from 'angular2-moment';
import {ElasticModule} from 'angular2-elastic';
@NgModule({
    declarations: [
        MyApp,
    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot(MyApp),
        IonicStorageModule.forRoot({
            name: '_sarisari',
            driverOrder: ['sqlite', 'indexeddb', 'websql']
        }),
        ReactiveFormsModule,
        CustomFormsModule,
         MomentModule,
         ElasticModule,
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
    ],
    providers: [
        StatusBar,
        SplashScreen,
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        Database
    ]
})
export class AppModule {}
