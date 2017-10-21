import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SellProductPage } from './sell-product';

@NgModule({
  declarations: [
    SellProductPage,
  ],
  imports: [
    IonicPageModule.forChild(SellProductPage),
  ],
})
export class SellProductPageModule {}
