import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Component  } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { NavRouterModule } from './NavMenu/nav-router/nav-router.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClientJsonpModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JsonpModule, HttpModule } from '@angular/http';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { ChartsModule } from 'ng2-charts';
import * as JsBarcode from 'jsbarcode';
import { ErrorpageComponent } from './ERROE/errorpage/errorpage.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { TextareaAutosizeModule } from 'ngx-textarea-autosize';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { SupplierMutipleQuoteComponent } from './Part_RFQ_Feedback/supplier-mutiple-quote/supplier-mutiple-quote.component';
import { MatTableModule } from "@angular/material/table";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { WebcamModule } from 'ngx-webcam';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
/* Service */
import { LoginService } from './Service/login.service';
import { RestfulRequester } from './Service/RestfulRequester.service';
import { PermissionService } from './Service/permission.service';
import { LoginComponent } from 'src/app/Login/login/login.component';
import { ModifypasswordComponent } from 'src/app/Login/modifypassword/modifypassword.component';
import { ForgetpasswordComponent } from 'src/app/Login/forgetpassword/forgetpassword.component';
import { ShowGroupOneComponent } from 'src/app/Part_OnePage/show-group-one/show-group-one.component';
import { ShowGroupEightComponent } from 'src/app/Part_OnePage/show-group-eight/show-group-eight.component';
import { DigitalSignageComponent } from 'src/app/Part_OnePage/digital-signage/digital-signage.component';
import { MoldStockChangeComponent } from './Part_OnePage/mold-stock-change/mold-stock-change.component';
import { MoldAccessRecordComponent } from './Part_OnePage/mold-access-record/mold-access-record.component';
import { ShutdownsettingComponent } from './Part_ParameterSetting/shutdownsetting/shutdownsetting.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { OrderShutRecordComponent } from './Part_Production/order-shut-record/order-shut-record.component';
import { DecimalPipe } from '@angular/common';
import { TestChartComponent } from './Part_Production/test-chart/test-chart.component';
import { MoldedNotPourComponent } from './Part_ProductionReport/molded-not-pour/molded-not-pour.component';
import { PostProcessRepWorkingComponent } from './Part_Production/post-process-rep-working/post-process-rep-working.component';// ��B�z��c�B�e�^��
import { PostProcEstiProdRptComponent } from './Part_ProductionReport/post-proc-esti-prod-rpt/post-proc-esti-prod-rpt.component';// ��B�z�w�p�Ͳ��O�����Ӫ�
import { PostProcQueryComponent } from './Part_Production/post-proc-query/post-proc-query.component';// ��B�z���u�d��
import { RemoveBursReportComponent } from 'src/app/Part_ProductionReport/remove-burs-report/remove-burs-report.component';
import { EstiUnPackingRptComponent } from './Part_ProductionReport/esti-un-packing-rpt/esti-un-packing-rpt.component';
import { SupplementReportWorkingComponent } from './Part_Production/supplement-report-working/supplement-report-working.component';
import { ProdProcTrackingComponent } from './Part_Production/prod-proc-tracking/prod-proc-tracking.component';
import { FlaskHistoryComponent } from './Part_ProductionReport/flask-history/flask-history.component';
import { CancelTrackingComponent } from './Part_Production/cancel-tracking/cancel-tracking.component';
import { ExceptionWorkHourComponent } from './Part_Production/exception-work-hour/exception-work-hour.component';
import { AuthInterceptor } from './auth/auth.interceptor';
// import { BarcodeComponent } from "./barcode/BarcodeComponent.2";
// import { WorkOrderBarcodePrintComponent } from './Part_Production/work-order-barcode-print/work-order-barcode-print.component';


@NgModule({
declarations: [
    AppComponent,
    ErrorpageComponent,
    ModifypasswordComponent,
    ForgetpasswordComponent,
    LoginComponent,
    DigitalSignageComponent,
    ShowGroupOneComponent,
    ShowGroupEightComponent,
    MoldStockChangeComponent,
    MoldAccessRecordComponent,
    ShutdownsettingComponent,
    OrderShutRecordComponent,
    TestChartComponent,
    MoldedNotPourComponent,
    PostProcessRepWorkingComponent,
    PostProcEstiProdRptComponent,
    PostProcQueryComponent,
    RemoveBursReportComponent,
    EstiUnPackingRptComponent,
    SupplementReportWorkingComponent,
    ProdProcTrackingComponent,
    FlaskHistoryComponent,
    CancelTrackingComponent,
    ExceptionWorkHourComponent,
    // BarcodeComponent,
    // WorkOrderBarcodePrintComponent
  ],
  imports: [
    FormsModule,
    NavRouterModule,
    BrowserModule,
    NgbModule,
    AppRoutingModule,
    HttpClientModule,
    HttpModule,
    HttpClientJsonpModule,
    JsonpModule,
    TextareaAutosizeModule,
    NgxWebstorageModule.forRoot(),
    FlashMessagesModule.forRoot(),
    ReactiveFormsModule,
    PdfViewerModule,
    BrowserAnimationsModule,
    MatTableModule,
    WebcamModule,
    NgxSpinnerModule,
    ChartsModule,
    SweetAlert2Module.forRoot(),
    ZXingScannerModule,
    NgxDatatableModule,
  ], exports: [
    ChartsModule
  ],
  providers: [
    PermissionService,
    LoginService,
    RestfulRequester,
    DecimalPipe,
    {
      provide:HTTP_INTERCEPTORS,
      useClass:AuthInterceptor,
      multi:true
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: [SupplierMutipleQuoteComponent]
})
export class AppModule { }
