import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReportByProductPage } from './report-by-product';

@NgModule({
  declarations: [
    ReportByProductPage,
  ],
  imports: [
    IonicPageModule.forChild(ReportByProductPage),
  ],
})
export class ReportByProductPageModule {}
