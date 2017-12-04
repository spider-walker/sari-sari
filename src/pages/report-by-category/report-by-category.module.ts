import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReportByCategoryPage } from './report-by-category';

@NgModule({
  declarations: [
    ReportByCategoryPage,
  ],
  imports: [
    IonicPageModule.forChild(ReportByCategoryPage),
  ],
})
export class ReportByCategoryPageModule {}
