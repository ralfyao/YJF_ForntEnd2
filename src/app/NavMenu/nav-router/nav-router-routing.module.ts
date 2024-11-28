import { EstiUnPackingRptComponent } from './../../Part_ProductionReport/esti-un-packing-rpt/esti-un-packing-rpt.component';
import { ModulMaintainInquireComponent } from './../../modulMaintainInquire/modulMaintainInquire.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NavigationComponent } from '../navigation/navigation.component';

/* 系統管理 */
import { MemberListComponent } from 'src/app/Part_member/member-list/member-list.component';
import { SettingComponent } from 'src/app/Part_ParameterSetting/setting/setting.component';
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
import { ModifyDetailComponent } from 'src/app/Part_MantainOrder/modifydetail/modifydetail.component';
import { AddmatainorderComponent } from 'src/app/Part_MantainOrder/add-matainorder/addmatainorder.component';
/* 生產管理 */
import { ProductionStatusComponent } from 'src/app/Part_Production/ProductionStatus/ProductionStatus.component';
import { ShopFloorComponent } from 'src/app/Part_Production/shop-floor/shop-floor.component';
import { SchedulingComponent } from 'src/app/Part_Production/scheduling/scheduling.component';
import { ScheduleResultComponent } from 'src/app/Part_Production/schedule-result/schedule-result.component';
import { CustomerSchedulingComponent } from 'src/app/Part_Production/customer-scheduling/customer-scheduling.component';
import { ProductionOrderComponent } from 'src/app/Part_Production/production-order/production-order.component';
import { DefectReportComponent } from 'src/app/Part_Production/defect-report/defect-report.component';
import { ProductionChartComponent } from './../../Part_Production/production-chart/production-chart.component';
import { OrderStatusComponent } from 'src/app/Part_Production/order-status/order-status.component';
import { SFTRecordComponent } from 'src/app/Part_Production/sftrecord/sftrecord.component';
import { OutsourcedListComponent } from 'src/app/Part_Production/outsourced-list/outsourced-list.component';
import { StandardCapacityComponent } from 'src/app/standardCapacity/standardCapacity.component';
import { ProductionCapacityComponent } from 'src/app/Part_Production/production-capacity/production-capacity.component';
import { OrderShutRecordComponent } from 'src/app/Part_Production/order-shut-record/order-shut-record.component';
/* 生產報表管理 */
import { ProductionLineReportComponent } from 'src/app/Part_ProductionReport/production-line-report/production-line-report.component';
// import { EstiUnPackingRptComponent } from 'src/app/Part_ProductionReport/esti-un-packing-rpt/esti-un-packing-rpt.component';
import { MoldingCoreReportComponent } from 'src/app/Part_ProductionReport/molding-core-report/molding-core-report.component';
import { ComplexReportComponent } from 'src/app/Part_ProductionReport/complex-report/complex-report.component';
import { ShipmentStateComponent } from 'src/app/Part_ProductionReport/shipment-state/shipment-state.component';
import { DispatchListComponent } from 'src/app/Part_Production/dispatch-list/dispatch-list.component';
import { MeltingSalesRecordComponent } from 'src/app/Part_MeltingCastingManager/melting-sales-record/melting-sales-record.component';
import { MoldedNotPourComponent } from 'src/app/Part_ProductionReport/molded-not-pour/molded-not-pour.component';
import { ScheduleManagementViceComponent } from 'src/app/Part_Production/schedule-management-vice/schedule-management-vice.component';
/* 採購報表 */
import { PurchaseReportComponent } from 'src/app/Part_PurchaseReport/purchase-report/purchase-report.component';
/* 業務流程 */
import { RFQListComponent } from 'src/app/Part_RFQ/rfq-list/rfq-list.component';
import { AddRfqComponent } from 'src/app/Part_RFQ/add-rfq/add-rfq.component';
import { RFQResultListComponent } from 'src/app/Part_RFQ_Result/rfq-result-list/rfq-result-list.component';
import { RFQResultCheckOutComponent } from 'src/app/Part_RFQ_Result/rfq-result-check-out/rfq-result-check-out.component';
import { RFQFeedbackListComponent } from 'src/app/Part_RFQ_Feedback/rfq-feedback-list/rfq-feedback-list.component';
import { SupplierQuotationComponent } from 'src/app/Part_RFQ_Feedback/supplier-quotation/supplier-quotation.component';
import { RFQSupplierStatusComponent } from 'src/app/Part_RFQ_Result/rfq-supplier-status/rfq-supplier-status.component';
import { RfqResultCheckOutCostReviewComponent } from 'src/app/Part_RFQ_Result/rfq-result-check-out-cost-review/rfq-result-check-out-cost-review.component';
import { SupplierMutipleQuoteComponent } from 'src/app/Part_RFQ_Feedback/supplier-mutiple-quote/supplier-mutiple-quote.component'
/* 爐前管制表 */
import { MeltingCastingManagerComponent } from 'src/app/Part_MeltingCastingManager/melting-casting-manager/melting-casting-manager.component';
import { MeltingCastingManagerDetailComponent } from 'src/app/Part_MeltingCastingManager/melting-casting-manager-detail/melting-casting-manager-detail.component';
import { ProductManagerComponent } from 'src/app/Part_MeltingCastingManager/product-manager/product-manager.component';
import { ProductManagerDetailComponent } from 'src/app/Part_MeltingCastingManager/product-manager-detail/product-manager-detail.component';
import { PouringRecordComponent } from 'src/app/Part_MeltingCastingManager/pouring-record/pouring-record.component';
import { DailyReportComponent } from 'src/app/Part_MeltingCastingManager/daily-report/daily-report.component';
import { PickingAbnormalComponent } from 'src/app/Part_MeltingCastingManager/picking-abnormal/picking-abnormal.component';
/* 其他 */
import { IndexComponent } from '../navigation/index/index.component';
import { AuthGuard } from 'src/app/auth/auth.guard'
import { ChildrenauthGuard } from 'src/app/auth/childrenauth.guard'
import { MouldMaintainReqeustComponent } from 'src/app/mouldMaintainReqeust/mouldMaintainReqeust.component';
import { ScheduleManagementComponent } from 'src/app/Part_Production/scheduleManagement/scheduleManagement.component';
import { PostProcEstiProdRptComponent } from 'src/app/Part_ProductionReport/post-proc-esti-prod-rpt/post-proc-esti-prod-rpt.component';
import { PostProcQueryComponent } from 'src/app/Part_Production/post-proc-query/post-proc-query.component';
import { RemoveBursReportComponent } from 'src/app/Part_ProductionReport/remove-burs-report/remove-burs-report.component';
import { SupplementReportWorkingComponent } from 'src/app/Part_Production/supplement-report-working/supplement-report-working.component';
import { ProdProcTrackingComponent } from 'src/app/Part_Production/prod-proc-tracking/prod-proc-tracking.component';
import { FlaskHistoryComponent } from 'src/app/Part_ProductionReport/flask-history/flask-history.component';
import { CancelTrackingComponent } from 'src/app/Part_Production/cancel-tracking/cancel-tracking.component';
import { ExceptionWorkHourComponent } from 'src/app/Part_Production/exception-work-hour/exception-work-hour.component';


const routes: Routes = [
  {
    path: 'login_success', component: NavigationComponent, canActivate: [AuthGuard], canActivateChild: [ChildrenauthGuard], children:
      [
        { path: '', redirectTo: 'Index', pathMatch: 'full' },
        { path: 'Index', component: IndexComponent },
        //系統管理
        { path: 'AccountManager', component: MemberListComponent },
        { path: 'ParameterSetting', component: SettingComponent },
        { path: 'MenuSetting', component: MenuSettingComponent },
        { path: 'PageSetting', component: PageSettingComponent },
        { path: 'PermissionSetting', component: PermissionGroupComponent },
        { path: 'GetShutDownList', component: OrderShutComponent },
        //資料建立
        { path: 'CustomerManage', component: CustomerListComponent },
        { path: 'CustomerManageDetail', component: AddCustomerComponent },
        //保修單作業
        { path: 'MantainOrder', component: MOListComponent },
        { path: 'MantainOrderDetail', component: MODetailistComponent },
        { path: 'MantainOrderYJFDetail', component: ModifyDetailComponent },
        { path: 'AddMatainOrder', component: AddmatainorderComponent },
        //生產管理
        { path: 'ProductionStatus', component: ProductionStatusComponent },
        { path: 'ShopFloor', component: ShopFloorComponent },
        { path: 'Scheduling', component: SchedulingComponent },
        { path: 'ScheduleResult', component: ScheduleResultComponent },
        { path: 'CustomerScheduling', component: CustomerSchedulingComponent },
        { path: 'ProductionOrder', component: ProductionOrderComponent },
        { path: 'defectreport', component: DefectReportComponent },
        { path: 'productionchart', component: ProductionChartComponent },
        { path: 'orderstatus', component: OrderStatusComponent },
        { path: 'SFTRecord', component: SFTRecordComponent },
        { path: 'OutsourcedList', component: OutsourcedListComponent },
        { path: 'StandardCapacity', component: StandardCapacityComponent },
        { path: 'productionCapacityChart', component: ProductionCapacityComponent},
        { path: 'orderShutDownRecord', component:OrderShutRecordComponent},
        { path: 'scheduleManagementVide',component:ScheduleManagementViceComponent},
        { path: 'SupplementReportWorking', component:SupplementReportWorkingComponent},
        { path: 'ProdProcessTracking', component:ProdProcTrackingComponent},
        { path: 'CancelTracking', component:CancelTrackingComponent},
        { path: 'ExceptionWorkHour', component:ExceptionWorkHourComponent},//例外工時
        //生產報表管理
        { path: 'ProductionLineReport', component: ProductionLineReportComponent },
        { path: 'EstiUnPackingRpt', component:EstiUnPackingRptComponent },
        { path: 'MoldingCoreReport', component: MoldingCoreReportComponent },
        { path: 'ComplexReportReport', component: ComplexReportComponent },
        { path: 'ShipmentState', component: ShipmentStateComponent },
        { path: 'DispatchList', component: DispatchListComponent },
        { path: 'MeltingSalesRecord', component: MeltingSalesRecordComponent },
        { path: 'MoldedNotPour', component:MoldedNotPourComponent},
        { path: 'PostProcEstiProdRpt', component:PostProcEstiProdRptComponent},
        { path: 'PostProcQuery',component:PostProcQueryComponent},
        { path: 'RemoveBursReport', component:RemoveBursReportComponent},
        { path: 'FlaskHistory', component:FlaskHistoryComponent},
        //採購報表
        { path: 'PurchaseReport', component: PurchaseReportComponent },
        //業務流程
        { path: 'RFQList', component: RFQListComponent },
        { path: 'RFQListDetail', component: AddRfqComponent },
        { path: 'RFQResultList', component: RFQResultListComponent },
        { path: 'RFQResulCheckOut', component: RFQResultCheckOutComponent },
        { path: 'RFQFeedback', component: RFQFeedbackListComponent },
        { path: 'SupplierQuotation', component: SupplierQuotationComponent },
        { path: 'RFQSupplierStatusComponent', component: RFQSupplierStatusComponent },
        { path: 'RfqResultCheckOutCostReview', component: RfqResultCheckOutCostReviewComponent },
        { path: 'SupplierMutipleQuoteComponent', component: SupplierMutipleQuoteComponent },
        //爐前管制表
        { path: 'MeltingCastingManager', component: MeltingCastingManagerComponent },
        { path: 'MeltingCastingManagerDetail', component: MeltingCastingManagerDetailComponent },
        { path: 'ProductManager', component: ProductManagerComponent },
        { path: 'ProductManagerDetail', component: ProductManagerDetailComponent },
        { path: 'PouringRecord', component: PouringRecordComponent },
        { path: 'DailyPouringList', component: DailyReportComponent },
        { path: 'PickingAbnormal', component: PickingAbnormalComponent },
        //模具叫修單
        { path: 'ModuldMaintainRequest', component: MouldMaintainReqeustComponent },
        //模具叫修單查詢
        { path: 'modulMaintainInquire', component: ModulMaintainInquireComponent },
        //排程管理Beta
        { path: 'ScheduleManagement', component: ScheduleManagementComponent }
      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NavRouterRoutingModule { }
