import { PostProcessRepWorkingComponent } from './Part_Production/post-process-rep-working/post-process-rep-working.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './Login/login/login.component';
import { ForgetpasswordComponent } from './Login/forgetpassword/forgetpassword.component';
import { ModifypasswordComponent } from './Login/modifypassword/modifypassword.component';
import { ReportWorkingComponent } from './Part_Production/report-working/report-working.component';
import { MoldStockChangeComponent } from './Part_OnePage/mold-stock-change/mold-stock-change.component';
import { MoldAccessRecordComponent } from './Part_OnePage/mold-access-record/mold-access-record.component';
import { DigitalSignageComponent } from './Part_OnePage/digital-signage/digital-signage.component';
import { ShowGroupOneComponent } from './Part_OnePage/show-group-one/show-group-one.component';
import { ShowGroupEightComponent } from './Part_OnePage/show-group-eight/show-group-eight.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'forgot_password', component: ForgetpasswordComponent },
  { path: 'modify_password', component: ModifypasswordComponent },
  { path: 'report_working', component: ReportWorkingComponent },//報工畫面
  { path: 'post_process_repworking', component:PostProcessRepWorkingComponent},//後處理報工畫面
  { path: 'MoldStockChange', component: MoldStockChangeComponent },//備模出入庫作業
  { path: 'MoldAccessRecord', component: MoldAccessRecordComponent },//備模進出廠作業
  { path: 'Digital_Signage', component: DigitalSignageComponent },//刊版歡迎畫面
  { path: 'ShowOneChart', component: ShowGroupOneComponent },//廠內電視造模1組
  { path: 'ShowEightChart', component: ShowGroupEightComponent },//廠內電視造模8組
  { path: '**', redirectTo: 'login' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
