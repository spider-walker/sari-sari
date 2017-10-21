import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CriticalProductPage } from './critical-product';

@NgModule({
  declarations: [
    CriticalProductPage,
  ],
  imports: [
    IonicPageModule.forChild(CriticalProductPage),
  ],
})
export class CriticalProductPageModule {}
