
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxWebstorageModule } from 'ngx-webstorage';

/* Module */
import { NavRouterRoutingModule } from '../nav-router/nav-router-routing.module';

/* Component */
import { NavigationComponent } from '../navigation/navigation.component';
import { NavGroupComponent } from '../navigation/nav-group/nav-group.component';
import { NavItemComponent } from '../navigation/nav-item/nav-item.component';
import { IndexComponent } from '../navigation/index/index.component';
import { DynamicComponentHostDirective } from 'src/app/CommomModule/compomenthost.directive';
/* 系統管理 */
import { SettingComponent } from 'src/app/Part_ParameterSetting/setting/setting.component';
import { MeltCastSettingComponent } from 'src/app/Part_ParameterSetting/melt-cast-setting/melt-cast-setting.component';
import { RFQSettingComponent } from 'src/app/Part_ParameterSetting/rfqsetting/rfqsetting.component';
import { MemberListComponent } from 'src/app/Part_member/member-list/member-list.component';
import { MenuSettingComponent } from 'src/app/Part_permission/menu-setting/menu-setting.component';
import { PageSettingComponent } from 'src/app/Part_permission/page-setting/page-setting.component';
import { PermissionGroupComponent } from 'src/app/Part_permission/permission-group/permission-group.component';
import { OrderShutComponent } from 'src/app/Part_Production/order-shut/order-shut.component';
/* 資料建立 */
import { CustomerListComponent } from 'src/app/Part_customer/customer-list/customer-list.component';
import { AddCustomerComponent } from 'src/app/Part_customer/add-customer/add-customer.component';
/* 保修單作業 */
import { MOListComponent } from 'src/app/Part_MantainOrder/mo-list/mo-list.component';
import { MODetailistComponent } from 'src/app/Part_MantainOrder/mo-detailist/mo-detailist.component';
import { AddmatainorderComponent } from 'src/app/Part_MantainOrder/add-matainorder/addmatainorder.component';
import { ModifyDetailComponent } from 'src/app/Part_MantainOrder/modifydetail/modifydetail.component';
/* 生產管理 */
import { ProductionStatusComponent } from 'src/app/Part_Production/ProductionStatus/ProductionStatus.component';
import { ShopFloorComponent } from 'src/app/Part_Production/shop-floor/shop-floor.component';
import { ScheduleResultComponent } from 'src/app/Part_Production/schedule-result/schedule-result.component';
import { CustomerSchedulingComponent } from 'src/app/Part_Production/customer-scheduling/customer-scheduling.component';
import { SchedulingComponent } from 'src/app/Part_Production/scheduling/scheduling.component';
import { ProductionOrderComponent } from 'src/app/Part_Production/production-order/production-order.component';
import { DefectReportComponent } from 'src/app/Part_Production/defect-report/defect-report.component';
import { ProductionChartComponent } from 'src/app/Part_Production/production-chart/production-chart.component';
import { OrderStatusComponent } from 'src/app/Part_Production/order-status/order-status.component';
import { ReportWorkingComponent } from 'src/app/Part_Production/report-working/report-working.component';
import { SFTRecordComponent } from 'src/app/Part_Production/sftrecord/sftrecord.component';
import { OutsourcedListComponent } from 'src/app/Part_Production/outsourced-list/outsourced-list.component';
/* 生產管理報表 */
import { ProductionLineReportComponent } from 'src/app/Part_ProductionReport/production-line-report/production-line-report.component';
import { MoldingCoreReportComponent } from 'src/app/Part_ProductionReport/molding-core-report/molding-core-report.component';
import { ComplexReportComponent } from 'src/app/Part_ProductionReport/complex-report/complex-report.component';
import { ShipmentStateComponent } from 'src/app/Part_ProductionReport/shipment-state/shipment-state.component';
import { DispatchListComponent } from 'src/app/Part_Production/dispatch-list/dispatch-list.component';
import { MeltingSalesRecordComponent } from 'src/app/Part_MeltingCastingManager/melting-sales-record/melting-sales-record.component';
/* 採購報表 */
import { PurchaseReportComponent } from 'src/app/Part_PurchaseReport/purchase-report/purchase-report.component';
/* 業務流程 */
import { RFQListComponent } from 'src/app/Part_RFQ/rfq-list/rfq-list.component';
import { AddRfqComponent } from 'src/app/Part_RFQ/add-rfq/add-rfq.component';
import { RFQResultCheckOutComponent } from 'src/app/Part_RFQ_Result/rfq-result-check-out/rfq-result-check-out.component';
import { RFQResultListComponent } from 'src/app/Part_RFQ_Result/rfq-result-list/rfq-result-list.component';
import { RfqResultCheckOutCostReviewComponent } from 'src/app/Part_RFQ_Result/rfq-result-check-out-cost-review/rfq-result-check-out-cost-review.component';
import { RFQSupplierStatusComponent } from 'src/app/Part_RFQ_Result/rfq-supplier-status/rfq-supplier-status.component';
import { RFQFeedbackListComponent } from 'src/app/Part_RFQ_Feedback/rfq-feedback-list/rfq-feedback-list.component';
import { SupplierMutipleQuoteComponent } from 'src/app/Part_RFQ_Feedback/supplier-mutiple-quote/supplier-mutiple-quote.component';
import { SupplierQuotationComponent } from 'src/app/Part_RFQ_Feedback/supplier-quotation/supplier-quotation.component';
/* 爐前管制表 */
import { MeltingCastingManagerComponent } from 'src/app/Part_MeltingCastingManager/melting-casting-manager/melting-casting-manager.component';
import { ProductManagerComponent } from 'src/app/Part_MeltingCastingManager/product-manager/product-manager.component';
import { MeltingCastingManagerDetailComponent } from 'src/app/Part_MeltingCastingManager/melting-casting-manager-detail/melting-casting-manager-detail.component';
import { ProductManagerDetailComponent } from 'src/app/Part_MeltingCastingManager/product-manager-detail/product-manager-detail.component';
import { PouringRecordComponent } from 'src/app/Part_MeltingCastingManager/pouring-record/pouring-record.component';
import { DailyReportComponent } from 'src/app/Part_MeltingCastingManager/daily-report/daily-report.component';
import { PickingAbnormalComponent } from 'src/app/Part_MeltingCastingManager/picking-abnormal/picking-abnormal.component';
/* Service */
import { ParameterSettingService } from 'src/app/Service/parameter-setting.service';
import { CustomService } from 'src/app/Service/Custom.service';
import { MemberManageService } from 'src/app/Service/member-manage.service';
import { MoService } from 'src/app/Service/mo.service';
import { RFQService } from 'src/app/Service/rfq.service';
import { PouringDataService } from 'src/app/Service/PouringData.service';
import { ProdutionService } from 'src/app/Service/ProdutionService';
import { ProdutionReportService } from 'src/app/Service/ProductionReport.service';

/* 擴充 */
import { FormsModule, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NgbPaginationModule, NgbModule, NgbProgressbar } from '@ng-bootstrap/ng-bootstrap';
import { Ng5SliderModule } from 'ng5-slider';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { TextareaAutosizeModule } from 'ngx-textarea-autosize';
import { NgxSelectModule } from 'ngx-select-ex';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ChartsModule } from 'ng2-charts';
import { NgProgressModule } from 'ngx-progressbar';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
// FormField、Input Module
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
// Datepicker Module
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatSortModule } from '@angular/material/sort';
import { ErrorMessageComponent } from 'src/app/UI/errorMessage/errorMessage.component';
import { ModulMaintainInquireComponent } from 'src/app/modulMaintainInquire/modulMaintainInquire.component';
import { MouldMaintainReqeustComponent } from 'src/app/mouldMaintainReqeust/mouldMaintainReqeust.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { StandardCapacityComponent } from 'src/app/standardCapacity/standardCapacity.component';
import { ScheduleManagementComponent } from 'src/app/Part_Production/scheduleManagement/scheduleManagement.component';
import { ScheduleTrialComponent } from 'src/app/Part_Production/scheduleTrial/scheduleTrial.component';
import { ProductionCapacityComponent } from 'src/app/Part_Production/production-capacity/production-capacity.component';
import { ScheduleManagementViceComponent } from 'src/app/Part_Production/schedule-management-vice/schedule-management-vice.component';
@NgModule({
  declarations: [
    SettingComponent,
    MeltCastSettingComponent,
    OrderShutComponent,
    RFQSettingComponent,
    ModifyDetailComponent,
    MemberListComponent,
    DynamicComponentHostDirective,
    CustomerListComponent,
    RFQListComponent,
    RFQResultListComponent,
    RFQFeedbackListComponent,
    MOListComponent,
    MODetailistComponent,
    AddCustomerComponent,
    AddRfqComponent,
    RFQResultCheckOutComponent,
    MeltingCastingManagerComponent,
    ProductManagerComponent,
    MeltingCastingManagerDetailComponent,
    ProductManagerDetailComponent,
    AddmatainorderComponent,
    ProductionStatusComponent,
    ShopFloorComponent,
    RfqResultCheckOutCostReviewComponent,
    ScheduleResultComponent,
    MeltCastSettingComponent,
    RFQSettingComponent,
    ProductionStatusComponent,
    ProductionCapacityComponent,
    ShopFloorComponent,
    SchedulingComponent,
    CustomerSchedulingComponent,
    RfqResultCheckOutCostReviewComponent,
    PouringRecordComponent,
    RFQSupplierStatusComponent,
    SupplierMutipleQuoteComponent,
    SupplierQuotationComponent,
    NavigationComponent,
    NavGroupComponent,
    NavItemComponent,
    ProductionOrderComponent,
    DefectReportComponent,
    ProductionChartComponent,
    OrderStatusComponent,
    ReportWorkingComponent,
    SFTRecordComponent,
    OutsourcedListComponent,
    ProductionLineReportComponent,
    MoldingCoreReportComponent,
    DailyReportComponent,
    PickingAbnormalComponent,
    MenuSettingComponent,
    PageSettingComponent,
    PermissionGroupComponent,
    IndexComponent,
    ComplexReportComponent,
    ShipmentStateComponent,
    DispatchListComponent,
    MeltingSalesRecordComponent,
    PurchaseReportComponent,
    ErrorMessageComponent,
    MouldMaintainReqeustComponent,
    ModulMaintainInquireComponent,
    StandardCapacityComponent,
    ScheduleManagementComponent,
    ScheduleTrialComponent,
    ScheduleManagementViceComponent,
  ],
  entryComponents: [

  ],
  imports: [
    FormsModule,
    CommonModule,
    NgbPaginationModule,
    Ng5SliderModule,
    NgbModule,
    NavRouterRoutingModule,
    ReactiveFormsModule,
    FlashMessagesModule,
    TextareaAutosizeModule,
    NgxSelectModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    ChartsModule,
    NgProgressModule,
    NgxDatatableModule,
    SweetAlert2Module.forRoot(),
    NgxWebstorageModule.forRoot(),
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatSortModule,
    NgxMatTimepickerModule,
    DragDropModule,
    ZXingScannerModule,
    MatAutocompleteModule
  ], exports: [
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatDatepickerModule,
    DragDropModule,
    ChartsModule,
    MatSortModule
  ],
  providers: [
    FormBuilder,
    ParameterSettingService,
    CustomService,
    MemberManageService,
    MatAutocompleteModule,
    MoService,
    RFQService,
    PouringDataService,
    ProdutionService,
    ProdutionReportService,
    { provide: MAT_DATE_LOCALE, useValue: 'zh-TW' }
  ]
})
export class NavRouterModule { }
