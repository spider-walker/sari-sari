import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReportByDatePage } from './report-by-date';

@NgModule({
  declarations: [
    ReportByDatePage,
  ],
  imports: [
    IonicPageModule.forChild(ReportByDatePage),
  ],
})
export class ReportByDatePageModule {}
