import { MainProductionOrder } from './../Model/production';
import { RestfulRequester } from 'src/app/Service/RestfulRequester.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SessionStorageService } from 'ngx-webstorage';
import { POstatus } from '../Model/production';
import { Injectable } from "@angular/core";
import { ExportSftRecordDataRequest } from 'src/bin/exportSftRecordDataRequest';
import { MonoTypeOperatorFunction, Observable, OperatorFunction } from 'rxjs';
import { ExportSftRecordDataResponse } from 'src/bin/exportSftRecordDataResponse';
import { SftLineListResponse } from 'src/bin/sftLineListResponse';
import { BasicAPIResponse } from 'src/bin/basicAPIResponse';
import { MoldIdListRequest } from 'src/bin/moldIdListRequest';
import { MoldIdListResponse } from 'src/bin/moldIdListResponse';
import { MoldRepairFormInquireRequest } from 'src/bin/moldRepairFormInquireRequest';
import { MoldRepairFormInquireResponse } from 'src/bin/moldRepairFormInquireResponse';
import { QueryProductionLineResponse } from 'src/bin/queryProductionLineResponse';
import { GetShutDownListRequest } from 'src/bin/getShutDownListRequest';
import { GetShutDownListResponse } from 'src/bin/getShutDownListResponse';
import { UpdateShutDownDetailRequest } from 'src/bin/updateShutDownDetailRequest';
import { DeleteShutDownReqeust } from 'src/bin/deleteShutDownReqeust';
import { QueryFlaskListRequest } from 'src/bin/queryFlaskListRequest';
import { QueryFlaskListResponse } from 'src/bin/queryFlaskListResponse';
import { TakeScheduleResultRequest } from 'src/bin/takeScheduleResultRequest';
import { TakeScheduleResultResponse } from 'src/bin/takeScheduleResultResponse';
import { POStatusListRequest } from 'src/bin/pOStatusListRequest';
import { POStatusListResponse } from 'src/bin/pOStatusListResponse';
import { FlaskListQueryRequest } from 'src/bin/flaskListQueryRequest';
import { FlaskListQueryResponse } from 'src/bin/flaskListQueryResponse';
import { POStatusListStockRequest } from 'src/bin/pOStatusListStockRequest';
import { POStatusListStockResponse } from 'src/bin/pOStatusListStockResponse';
import { CheckLimitRequest } from 'src/bin/checkLimitRequest';
import { CheckLimitResponse } from 'src/bin/checkLimitResponse';
import { AddLimitRequest } from 'src/bin/addLimitRequest';
import { AddLimitResponse } from 'src/bin/addLimitResponse';
import { CommonPhrasesListRequest } from 'src/bin/commonPhrasesListRequest';
import { CommonPhrasesListResponse } from 'src/bin/commonPhrasesListResponse';
import { RemoveFlasksMatchRequest } from 'src/bin/removeFlasksMatchRequest';
import { PoductionLeadTimeCHangeRequest } from 'src/bin/poductionLeadTimeCHangeRequest';
import { ChangePOstatusRequest } from 'src/bin/changePOstatusRequest';
import { QueryProductionLineReqeust } from 'src/bin/queryProductionLineReqeust';
import { SchedulingRequest } from 'src/bin/schedulingRequest';
import { RemoveScheduleTableRequest } from 'src/bin/removeScheduleTableRequest';
import { RemoveScheduleTableResponse } from 'src/bin/removeScheduleTableResponse';
import { CoreProductionListRequest } from 'src/bin/coreProductionListRequest';
import { CoreProductionListResponse } from 'src/bin/coreProductionListResponse';
import { ProductionOrderListRequest } from 'src/bin/productionOrderListRequest';
import { ProductionOrderListResponse } from 'src/bin/productionOrderListResponse';
import { POMOCTAPURCheckListRequest } from 'src/bin/pOMOCTAPURCheckListRequest';
import { POMOCTAPURCheckListResponse } from 'src/bin/pOMOCTAPURCheckListResponse';
import { SplitOrderListRequest } from 'src/bin/splitOrderListRequest';
import { SplitOrderListResponse } from 'src/bin/splitOrderListResponse';
import { InsertScheduleTableRequest } from 'src/bin/insertScheduleTableRequest';
import { InsertScheduleTableResponse } from 'src/bin/insertScheduleTableResponse';
import { SinglePOStatusListByPartNoRequest } from 'src/bin/singlePOStatusListByPartNoRequest';
import { SinglePOStatusListByPartNoResponse } from 'src/bin/singlePOStatusListByPartNoResponse';
import { UpdateProductionOrderPrintCountRequest } from 'src/bin/updateProductionOrderPrintCountRequest';
import { ShowRecordByPartNoRequest } from 'src/bin/showRecordByPartNoRequest';
import { ShowRecordByPartNoResponse } from 'src/bin/showRecordByPartNoResponse';
import { CMSMWQueryRequest } from 'src/bin/cMSMWQueryRequest';
import { CMSMWQueryResponse } from 'src/bin/cMSMWQueryResponse';
import { InsertSFTRequest } from 'src/bin/insertSFTRequest';
import { CancelSFTRequest } from 'src/bin/cancelSFTRequest';
import { ProductionStateListDataRequest } from 'src/bin/productionStateListDataRequest';
import { ProductionStateListDataResponse } from 'src/bin/productionStateListDataResponse';
import { ProcessDataListRequest } from 'src/bin/processDataListRequest';
import { ProcessDataListResponse } from 'src/bin/processDataListResponse';
import { ChangePODetailRequest } from 'src/bin/changePODetailRequest';
import { ChangePODetailResponse } from 'src/bin/changePODetailResponse';
import { DefectReportRequest } from 'src/bin/defectReportRequest';
import { DefectReportResponse } from 'src/bin/defectReportResponse';
import { ExportDefectReportRequest } from 'src/bin/exportDefectReportRequest';
import { ExportDefectReportResponse } from 'src/bin/exportDefectReportResponse';
import { ExportWoodenReportRequest } from 'src/bin/exportWoodenReportRequest';
import { ExportWoodenReportResponse } from 'src/bin/exportWoodenReportResponse';
import { ProductionChartDataRequest } from 'src/bin/productionChartDataRequest';
import { ProductionChartDataResponse } from 'src/bin/productionChartDataResponse';
import { InserFlaskUsagelogRequest } from 'src/bin/inserFlaskUsagelogRequest';
import { InserFlaskUsagelogResponse } from 'src/bin/inserFlaskUsagelogResponse';
import { FlaskDataChangeRequest } from 'src/bin/flaskDataChangeRequest';
import { FlaskDataChangeResponse } from 'src/bin/flaskDataChangeResponse';
import { FlaskSelectRequest } from 'src/bin/flaskSelectRequest';
import { UpdateSFCRequest } from 'src/bin/updateSFCRequest';
import { UpdateSFCResponse } from 'src/bin/updateSFCResponse';
import { WorkingDataRequest } from 'src/bin/workingDataRequest';
import { WorkingDataResponse } from 'src/bin/workingDataResponse';
import { GetPrepareMoldListRequest } from 'src/bin/getPrepareMoldListRequest';
import { GetPrepareMoldListResponse } from 'src/bin/getPrepareMoldListResponse';
import { OutsourcedDataRequest } from 'src/bin/outsourcedDataRequest';
import { OutsourcedDataResponse } from 'src/bin/outsourcedDataResponse';
import { BatchSFCForOutsourcedReqeust } from 'src/bin/batchSFCForOutsourcedReqeust';
import { BatchSFCForOutsourcedResponse } from 'src/bin/batchSFCForOutsourcedResponse';
import { SftRecordDataResponse } from 'src/bin/sftRecordDataResponse';
import { LineProdCapacityRequest } from 'src/bin/lineProdCapacityRequest';
import { LineProdCapacityResponse } from 'src/bin/lineProdCapacityResponse';
import { AddLineStandardCapacityRequest } from 'src/bin/addLineStandardCapacityRequest';
import { AddLineStandardCapacityResponse } from 'src/bin/addLineStandardCapacityResponse';
import { EditLineStandardCapacityRequest } from 'src/bin/editLineStandardCapacityRequest';
import { DelLineStandardCapacityRequest } from 'src/bin/delLineStandardCapacityRequest';
import { CalculateLineProductionRequest } from 'src/bin/calculateLineProductionRequest';
import { CalculateLineProductionResponse } from 'src/bin/calculateLineProductionResponse';
import { LineProductionScheduleListResponse } from 'src/bin/lineProductionScheduleListResponse';
import { LockOrderScheduleRequest } from 'src/bin/lockOrderScheduleRequest';
import { RecalLineProdScheduleRequest } from 'src/bin/recalLineProdScheduleRequest';
import { LineProductionScheduleListRequest } from 'src/bin/lineProductionScheduleListRequest';
import { QueryProdCapacityResponse } from 'src/bin/queryProdCapacityRespose';
import { QueryProdCapacityRequest } from 'src/bin/queryProdCapacityRequest';
import { TransSchToERPRequest } from 'src/bin/transSchToErp';
import { GetShutDownHistoryResponse } from 'src/bin/getShutDownHistoryResponse';
import { MoldedNotPourResponse } from 'src/bin/moldedNotPourResponse';
import { PostProcEstiProdResponse } from 'src/bin/postProcEstiProdResponse';
import { PostProcQueryRequest } from 'src/bin/postProcQueryRequest';
import { PostProcQueryResponse } from 'src/bin/postProcQueryResponse';
import { WorkOrderMeta } from 'src/bin/workOrderMeta';
import { LoadWorkOrderMeta } from 'src/bin/loadWorkOrderMeta';
import { ReportWorkOrderMetaReq } from 'src/bin/reportWorkOrderMetaReq';
import { CheckWorkerNumberResponse } from 'src/bin/checkWorkerNumberResponse';
import { RemoveBursReport } from 'src/bin/removeBursReport';
import { RemoveBursReportResponse } from 'src/bin/removeBursReportResponse';
import { ProductProcessTrackingResponse } from 'src/bin/productProcessTrackingResponse';
import { PourableDataResponse } from 'src/bin/pourableDataResponse';
import { MoldableDataResponse } from 'src/bin/moldableDataResponse';
import { LineGroupNameRep } from 'src/bin/lineGroupName';
import { FlaskHistoryRep } from 'src/bin/flaskHistoryResponse';
import { CancelTrackingRequest } from 'src/bin/cancelTrackingRequest';
import { HttpHeaders } from '@angular/common/http';



@Injectable()
export class ProdutionService extends RestfulRequester {
  apiExportDefaultRepWork(): Observable<any> {
    throw new Error('Method not implemented.');
  }

  apiQueryPartInfoByWO(parameter:any): Observable<any>{
    const body = JSON.stringify(parameter);
    const url = `${this.APserver}/api/QueryPartInfoByWO`;
    return this.http.post<any>(url, body, { headers:this.headers});
  }
  apiAddExceptionWorkHour(addParameter: any) :Observable<any>{
    const body = JSON.stringify(addParameter);
    const url = `${this.APserver}/api/AddExceptionWorkHour`;
    return this.http.post<any>(url, body, { headers:this.headers});
  }
  apiQueryExceptionWorkHour(parameter:any):Observable<any>{
    const body = JSON.stringify(parameter);
    const url = `${this.APserver}/api/QueryExceptionWorkHour`;
    return this.http.post<any>(url, body, { headers:this.headers});
  }
  apiCancelTracking(request: CancelTrackingRequest):Observable<BasicAPIResponse> {
    const body = JSON.stringify(request);
    const url = `${this.APserver}/Api/CancelTracking`;
    return this.http.post<BasicAPIResponse>(url, body, { headers: this.headers });
  }
  apiSendChangeEDTList(mailList: string[]):Observable<BasicAPIResponse>{
    const url = `${this.APserver}/Api/MailEDTChange`;
    return this.http.post<BasicAPIResponse>(url, mailList, { headers: this.headers });
  }
  apiFlaskUsageHistory(workOrder: string, flaskNo:string, flaskStep:string):Observable<FlaskHistoryRep> {
    const url = `${this.APserver}/Api/FlaskHistroy?workOrder=${workOrder}&flaskNo=${flaskNo}&flaskStep=${flaskStep}`;
    return this.http.get<FlaskHistoryRep>(url);
  }
  apiGetLineNames():Observable<LineGroupNameRep> {
    const url = `${this.APserver}/Api/LineGroupName`;
    return this.http.get<LineGroupNameRep>(url);
  }
  apiQueryPourableData():Observable<PourableDataResponse> {
    const url = `${this.APserver}/Api/SFCPourReadyData`;
    return this.http.get<PourableDataResponse>(url);
  }
  apiQueryMoldableData():Observable<MoldableDataResponse>  {
    const url = `${this.APserver}/Api/SFCMoldReadyData`;
    return this.http.get<MoldableDataResponse>(url);
  }
  apiQueryProductProcessTracking(WorkOrder: string, groupId:string, startDate:string = '', endDate:string = '', type:string = '', cancelTracking:boolean = false):Observable<ProductProcessTrackingResponse> {
    const url = `${this.APserver}/Api/ProductProcessTracking?workOrder=${WorkOrder}&groupId=${groupId}&startDate=${startDate}&endDate=${endDate}&type=${type}&cancelTracking=${cancelTracking}`;
    return this.http.get<ProductProcessTrackingResponse>(url);
  }
  apiExportPourableData():Observable<ExportDefectReportResponse> {
    const url = `${this.APserver}/Api/ExportSFCPourReadyData`;
    return this.http.get<ExportDefectReportResponse>(url);
  }
  // apiDumpStateListData(request: ProductionStateListDataRequest) {
  //   const body = JSON.stringify(request);
  //   const url = `${this.APserver}/Api/DumpStateListData`;
  //   return this.http.post<ExportDefectReportResponse>(url, body, { headers: this.headers });
  // }
  apiPostProcQuery(request: PostProcQueryRequest): Observable<PostProcQueryResponse> {
    const body = JSON.stringify(request);
    const url = `${this.APserver}/Api/PostProcQuery`;
    return this.http.post<PostProcQueryResponse>(url, body, { headers: this.headers });
  }
  apiPostProcQueryOn(request: PostProcQueryRequest): Observable<PostProcQueryResponse> {
    const body = JSON.stringify(request);
    const url = `${this.APserver}/Api/PostProcQueryOn`;
    return this.http.post<PostProcQueryResponse>(url, body, { headers: this.headers });
  }
  apiRemoveBursReport(InStationDateStart:string,InStationDateEnd:string):Observable<RemoveBursReportResponse>{
    const url = `${this.APserver}/Api/PostProcessValidWorkHour?startDate=${InStationDateStart}&endDate=${InStationDateEnd}`;
    return this.http.get<RemoveBursReportResponse>(url);
  }
  apiExportRemoveBursReport(InStationDateStart:string,InStationDateEnd:string):Observable<RemoveBursReportResponse>
  {
    const url = `${this.APserver}/Api/ExcelRemoveBursReport?dateStart=${InStationDateStart}&dateEnd=${InStationDateEnd}`;
    return this.http.get<RemoveBursReportResponse>(url);
  }
  apiCheckWorkerNumber(WorkerNumber:string):Observable<CheckWorkerNumberResponse>{
    const url = `${this.APserver}/Api/CheckWorkerNumber?WorkerNumber=${WorkerNumber}`;
    return this.http.get<CheckWorkerNumberResponse>(url);
  }
  apiLoadWorkOrderMeta(request:WorkOrderMeta):Observable<LoadWorkOrderMeta>
  {
    const body = JSON.stringify(request);
    const url = `${this.APserver}/Api/LoadWorkOrderMeta`;
    return this.http.post<LoadWorkOrderMeta>(url, body, { headers: this.headers });
  }
  apiReportWorkOrderMeta(request:ReportWorkOrderMetaReq):Observable<BasicAPIResponse>{
    const body = JSON.stringify(request);
    const url = `${this.APserver}/Api/ReportWorkOrderMeta`;
    return this.http.post<BasicAPIResponse>(url, body, { headers: this.headers });
  }
  apiExportMoldNotPourData(): Observable<ExportDefectReportResponse> {
    const url = `${this.APserver}/Api/ExportMoldedNotPour`;
    return this.http.get<ExportDefectReportResponse>(url);
  }
  apiExportMoldableData(): Observable<ExportDefectReportResponse> {
    const url = `${this.APserver}/Api/ExportSFCMoldReadyData`;
    return this.http.get<ExportDefectReportResponse>(url);
  }
  public apiGetShutDownHist(workOrder: string): Observable<GetShutDownHistoryResponse> {
    const url = `${this.APserver}/Api/GetShutDownHist?workOrder=${workOrder}`;
    return this.http.get<GetShutDownHistoryResponse>(url);
  }

  private session: SessionStorageService;
  super(session: SessionStorageService) {
    this.session = session;
  }

  public API_AddDashBoard(reportid: string) {
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/AddDashBoard?reportid=" + reportid, this.httpOptions).toPromise()
        .then(data => {
          resolve(data);
        })
        .catch((error: HttpErrorResponse) => {
          reject(error);
        });
    });
    return promise;
  }
  /**
   *取出人員維護的停單原因
   *
   * @param {GetShutDownListRequest} request
   * @return {*}  {Observable<GetShutDownListResponse>}
   * @memberof ProdutionService
   */
  apiGetShutDownList(request: GetShutDownListRequest): Observable<GetShutDownListResponse> {
    const body = JSON.stringify(request);
    const url = `${this.APserver}/Api/GetShutDownList`;
    return this.http.post<GetShutDownListResponse>(url, body, { headers: this.headers });
  }

  /**
   *更改訂單狀態的顯示
   *
   * @param {DeleteShutDownReqeust} request
   * @return {*}  {Observable<BasicAPIResponse>}
   * @memberof ProdutionService
   */
  apiDeleteShutDown(request: DeleteShutDownReqeust): Observable<BasicAPIResponse> {
    const body = JSON.stringify(request);
    const url = `${this.APserver}/Api/DeleteShutDownDetail`;
    return this.http.post<BasicAPIResponse>(url, body, { headers: this.headers });
  }

  /**
   *更新訂單狀態維護
   *
   * @param {UpdateShutDownDetailRequest} request
   * @return {*}  {Observable<BasicAPIResponse>}
   * @memberof ProdutionService
   */
  apiUpdateShutDownDetail(request: UpdateShutDownDetailRequest): Observable<BasicAPIResponse> {
    const body = JSON.stringify(request);
    const url = `${this.APserver}/Api/UpdateShutDownDetail`;
    return this.http.post<BasicAPIResponse>(url, body, { headers: this.headers });
  }

  apiUpdateScheduleERP(request: TransSchToERPRequest): Observable<BasicAPIResponse> {
    const body = JSON.stringify(request);
    const url = `${this.APserver}/Api/UpdateScheduledDate`;
    return this.http.post<BasicAPIResponse>(url, body, { headers: this.headers });
  }

  /**
   *庫存品號細節查詢
   *
   * @param {POStatusListStockRequest} request
   * @return {*}  {Observable<POStatusListStockResponse>}
   * @memberof ProdutionService
   */
  apiPOStatusListStock(request: POStatusListStockRequest): Observable<POStatusListStockResponse> {
    const body = JSON.stringify(request);
    const url = `${this.APserver}/Api/POStatusList_Stock`;
    return this.http.post<POStatusListStockResponse>(url, body, { headers: this.headers });
  }

  /**
   *取得鐵斗狀態
   *
   * @param {QueryFlaskListRequest} request
   * @return {*}  {Observable<QueryFlaskListResponse>}
   * @memberof ProdutionService
   */
  apiQueryFlaskList(request: QueryFlaskListRequest): Observable<QueryFlaskListResponse> {
    const body = JSON.stringify(request);
    const url = `${this.APserver}/Api/FlaskListSearch`;
    return this.http.post<QueryFlaskListResponse>(url, body, { headers: this.headers });
  }

  apiRemoveFlasksMatch(request: RemoveFlasksMatchRequest): Observable<BasicAPIResponse> {
    const body = JSON.stringify(request);
    const url = `${this.APserver}/Api/RemoveFlasksMatch`;
    return this.http.post<BasicAPIResponse>(url, body, { headers: this.headers });
  }

  apiCheckLimit(request: CheckLimitRequest): Observable<CheckLimitResponse> {
    const body = JSON.stringify(request);
    const url = `${this.APserver}/Api/CheckLimit`;
    return this.http.post<CheckLimitResponse>(url, body, { headers: this.headers });
  }

  public API_RemoveScheduleTable(Account: string, InserScheduleRange: Array<MainProductionOrder>) {
    const myObj = {
      Account: Account,
      InserScheduleRange: InserScheduleRange
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/RemoveScheduleTable",
        body, this.httpOptions).toPromise()
        .then(data => {
          resolve(data);
        })
        .catch((error: any) => {
          reject(false);
        });
    });
    return promise;
  }

  apiRemoveScheduleTable(request: RemoveScheduleTableRequest): Observable<RemoveScheduleTableResponse> {
    const body = JSON.stringify(request);
    const url = `${this.APserver}/Api/RemoveScheduleTable`;
    return this.http.post<RemoveScheduleTableResponse>(url, body, { headers: this.headers });
  }

  apiAddLimit(request: AddLimitRequest): Observable<AddLimitResponse> {
    const body = JSON.stringify(request);
    const url = `${this.APserver}/Api/AddLimit`;
    return this.http.post<AddLimitResponse>(url, body, { headers: this.headers });
  }


  apiTakeScheduleResult(request: TakeScheduleResultRequest): Observable<TakeScheduleResultResponse> {
    const body = JSON.stringify(request);
    const url = `${this.APserver}/Api/TakeScheduleResult`;
    return this.http.post<TakeScheduleResultResponse>(url, body, { headers: this.headers });
  }

  apiScheduling(request: SchedulingRequest): Observable<BasicAPIResponse> {
    const body = JSON.stringify(request);
    const url = `${this.APserver}/Api/Scheduling`;
    return this.http.post<BasicAPIResponse>(url, body, { headers: this.headers });
  }

  /**
   *收集品號、訂單、製令、採購數量匹配
   *
   * @param {POMOCTAPURCheckListRequest} request
   * @return {*}  {Observable<POMOCTAPURCheckListResponse>}
   * @memberof ProdutionService
   */
  apiPOMOCTAPURCheckList(request: POMOCTAPURCheckListRequest): Observable<POMOCTAPURCheckListResponse> {
    const body = JSON.stringify(request);
    const url = `${this.APserver}/Api/POMOCTAPURCheckList`;
    return this.http.post<POMOCTAPURCheckListResponse>(url, body, { headers: this.headers });
  }

  /**
   *利用品號尋找訂單、製令、採購
   *
   * @param {ShowRecordByPartNoRequest} request
   * @return {*}  {Observable<ShowRecordByPartNoResponse>}
   * @memberof ProdutionService
   */
  apiShowRecordByPartNo(request: ShowRecordByPartNoRequest): Observable<ShowRecordByPartNoResponse> {
    const body = JSON.stringify(request);
    const url = `${this.APserver}/Api/ShowRecordByPartNo`;
    return this.http.post<ShowRecordByPartNoResponse>(url, body, { headers: this.headers });
  }

  /**
   *查詢未完稱製造命令明細
   *
   * @param {ProductionOrderListRequest} request
   * @return {*}  {Observable<ProductionOrderListResponse>}
   * @memberof ProdutionService
   */
  apiProductionOrderList(request: ProductionOrderListRequest): Observable<ProductionOrderListResponse> {
    const body = JSON.stringify(request);
    const url = `${this.APserver}/Api/ProductionOrderList`;
    return this.http.post<ProductionOrderListResponse>(url, body, { headers: this.headers });
  }

  apiInsertScheduleTable(request: InsertScheduleTableRequest): Observable<InsertScheduleTableResponse> {
    const body = JSON.stringify(request);
    const url = `${this.APserver}/Api/InsertScheduleTable`;
    return this.http.post<InsertScheduleTableResponse>(url, body, { headers: this.headers });
  }

  apiSinglePOStatusListByPartNo(request: SinglePOStatusListByPartNoRequest): Observable<SinglePOStatusListByPartNoResponse> {
    const body = JSON.stringify(request);
    const url = `${this.APserver}/Api/SinglePOStatusListByPartNo`;
    return this.http.post<SinglePOStatusListByPartNoResponse>(url, body, { headers: this.headers });
  }

  apiFlaskListQuery(request: FlaskListQueryRequest): Observable<FlaskListQueryResponse> {
    const body = JSON.stringify(request);
    const url = `${this.APserver}/Api/FlaskListQuery`;
    return this.http.post<FlaskListQueryResponse>(url, body, { headers: this.headers });
  }

  apiCMSMWQuery(request: CMSMWQueryRequest): Observable<CMSMWQueryResponse> {
    const body = JSON.stringify(request);
    const url = `${this.APserver}/Api/CMSMWQuery`;
    return this.http.post<CMSMWQueryResponse>(url, body, { headers: this.headers });
  }

  apiInsertSFT(request: InsertSFTRequest): Observable<BasicAPIResponse> {
    const body = JSON.stringify(request);
    const url = `${this.APserver}/Api/InsertSFT`;
    return this.http.post<BasicAPIResponse>(url, body, { headers: this.headers });
  }

  apiCancelSFT(request: CancelSFTRequest): Observable<BasicAPIResponse> {
    const body = JSON.stringify(request);
    const url = `${this.APserver}/Api/CancelSFT`;
    return this.http.post<BasicAPIResponse>(url, body, { headers: this.headers });
  }

  apiQueryProdCapacityList(request: QueryProdCapacityRequest): Observable<QueryProdCapacityResponse> {
    const body = JSON.stringify(request);
    const url = `${this.APserver}/Api/GetProductionCapacityChart`;
    return this.http.post<QueryProdCapacityResponse>(url, body, { headers: this.headers });
  }

  apiCommonPhrasesList(request: CommonPhrasesListRequest): Observable<CommonPhrasesListResponse> {
    const body = JSON.stringify(request);
    const url = `${this.APserver}/Api/CommonPhrasesList`;
    return this.http.post<CommonPhrasesListResponse>(url, body, { headers: this.headers });
  }


  apiProductionLeadTimeCHange(request: PoductionLeadTimeCHangeRequest): Observable<BasicAPIResponse> {
    const body = JSON.stringify(request);
    const url = `${this.APserver}/Api/ProductionLeadTimeCHange`;
    return this.http.post<BasicAPIResponse>(url, body, { headers: this.headers });
  }

  apiProcessDataList(request: ProcessDataListRequest): Observable<ProcessDataListResponse> {
    const body = JSON.stringify(request);
    const url = `${this.APserver}/Api/ProcessDataList`;
    return this.http.post<ProcessDataListResponse>(url, body, { headers: this.headers });
  }

  apiChangePODetail(request: ChangePODetailRequest): Observable<ChangePODetailResponse> {
    const body = JSON.stringify(request);
    const url = `${this.APserver}/Api/ChangePODetail`;
    return this.http.post<ChangePODetailResponse>(url, body, { headers: this.headers });
  }

  apiChangePOstatus(request: ChangePOstatusRequest): Observable<BasicAPIResponse> {
    const body = JSON.stringify(request);
    const url = `${this.APserver}/Api/ChangePOstatus`;
    return this.http.post<BasicAPIResponse>(url, body, { headers: this.headers });
  }

  apiQueryProductionLine(request: QueryProductionLineReqeust): Observable<QueryProductionLineResponse> {
    const body = JSON.stringify(request);
    const url = `${this.APserver}/Api/QueryProductionLine`;
    return this.http.post<QueryProductionLineResponse>(url, body, { headers: this.headers });
  }

  apiQueryProductionCapacity(request: QueryProdCapacityRequest): Observable<QueryProdCapacityResponse> {
    const body = JSON.stringify(request);
    const url = `${this.APserver}/Api/GetProductionCapacityChart`;
    return this.http.post<QueryProdCapacityResponse>(url, body, { headers: this.headers });
  }

  apiPOStatusList(request: POStatusListRequest): Observable<POStatusListResponse> {
    const body = JSON.stringify(request);
    const url = `${this.APserver}/Api/POSTatusList`;
    return this.http.post<POStatusListResponse>(url, body, { headers: this.headers });
  }


  /**
   *異常報告
   *
   * @param {DefectReportRequest} request
   * @return {*}  {Observable<DefectReportResponse>}
   * @memberof ProdutionService
   */
  apiDefectReport(request: DefectReportRequest): Observable<DefectReportResponse> {
    const body = JSON.stringify(request);
    const url = `${this.APserver}/Api/DefectReport`;
    return this.http.post<DefectReportResponse>(url, body, { headers: this.headers });
  }

  /**
   *匯出異常報告Excel
   *
   * @param {ExportDefectReportRequest} request
   * @return {*}  {Observable<ExportDefectReportResponse>}
   * @memberof ProdutionService
   */
  apiExportDefectReport(request: ExportDefectReportRequest): Observable<ExportDefectReportResponse> {
    const body = JSON.stringify(request);
    const url = `${this.APserver}/Api/ExportDefectReport`;
    return this.http.post<ExportDefectReportResponse>(url, body, { headers: this.headers });
  }

  /**
   *匯出木模排程
   *
   * @param {ExportWoodenReportRequest} request
   * @return {*}  {Observable<ExportWoodenReportResponse>}
   * @memberof ProdutionService
   */
  apiExportWoodenReport(request: ExportWoodenReportRequest): Observable<ExportWoodenReportResponse> {
    const body = JSON.stringify(request);
    const url = `${this.APserver}/Api/ExportWoodenReport`;
    return this.http.post<ExportWoodenReportResponse>(url, body, { headers: this.headers });
  }

  apiUpdateProductionOrderPrintCount(request: UpdateProductionOrderPrintCountRequest): Observable<BasicAPIResponse> {
    const body = JSON.stringify(request);
    const url = `${this.APserver}/Api/UpdateProductionOrderPrintCount`;
    return this.http.post<BasicAPIResponse>(url, body, { headers: this.headers });
  }

  apiProductionChartData(request: ProductionChartDataRequest): Observable<ProductionChartDataResponse> {
    const body = JSON.stringify(request);
    const url = `${this.APserver}/Api/ProductionChartData`;
    return this.http.post<ProductionChartDataResponse>(url, body, { headers: this.headers });
  }

  apiProductionStateListData(request: ProductionStateListDataRequest): Observable<ProductionStateListDataResponse> {
    const body = JSON.stringify(request);
    const url = `${this.APserver}/Api/ProductionStateListData`;
    return this.http.post<ProductionStateListDataResponse>(url, body, { headers: this.headers });
  }

  public apiSftRecordData(request: ExportSftRecordDataRequest): Observable<SftRecordDataResponse> {
    const body = JSON.stringify(request);
    const url = `${this.APserver}/Api/SFTRecordData`;

    return this.http.post<SftRecordDataResponse>(url, body, { headers: this.headers });

  }

  public apiMoldedNotPourList(): Observable<MoldedNotPourResponse> {
    const url = `${this.APserver}/Api/MoldedNotPour`;

    return this.http.get<MoldedNotPourResponse>(url);
  }


  public apiSftLineList(): Observable<SftLineListResponse> {
    const url = `${this.APserver}/api/LineList`;
    return this.http.get<SftLineListResponse>(url);
  }


  public apiExportSftRecordData(request: ExportSftRecordDataRequest): Observable<ExportSftRecordDataResponse> {
    const body = JSON.stringify(request);
    const url = `${this.APserver}/Api/ExportSftRecordData`;

    return this.http.post<ExportSftRecordDataResponse>(url, body, { headers: this.headers });
  }


  apiCoreProductionList(request: CoreProductionListRequest): Observable<CoreProductionListResponse> {
    const body = JSON.stringify(request);
    const url = `${this.APserver}/Api/CoreProductionList`;
    return this.http.post<CoreProductionListResponse>(url, body, { headers: this.headers });
  }

  apiSplitOrderList(request: SplitOrderListRequest): Observable<SplitOrderListResponse> {
    const body = JSON.stringify(request);
    const url = `${this.APserver}/Api/SplitOrderList`;
    return this.http.post<SplitOrderListResponse>(url, body, { headers: this.headers });
  }

  apiInserFlaskUsagelog(request: InserFlaskUsagelogRequest): Observable<InserFlaskUsagelogResponse> {
    const body = JSON.stringify(request);
    const url = `${this.APserver}/Api/InserFlaskUsagelog`;
    return this.http.post<InserFlaskUsagelogResponse>(url, body, { headers: this.headers });
  }

  apiFlaskDataChange(request: FlaskDataChangeRequest): Observable<FlaskDataChangeResponse> {
    const body = JSON.stringify(request);
    const url = `${this.APserver}/Api/FlaskDataChange`;
    return this.http.post<FlaskDataChangeResponse>(url, body, { headers: this.headers });
  }

  apiFlaskSelect(request: FlaskSelectRequest): Observable<BasicAPIResponse> {
    const body = JSON.stringify(request);
    const url = `${this.APserver}/Api/FlaskSelect`;
    return this.http.post<BasicAPIResponse>(url, body, { headers: this.headers });
  }

  /**
   *新增SFT 做進出站功能
   *
   * @param {UpdateSFCRequest} request
   * @return {*}  {Observable<UpdateSFCResponse>}
   * @memberof ProdutionService
   */
  apiUpdateSFC(request: UpdateSFCRequest): Observable<UpdateSFCResponse> {
    const body = JSON.stringify(request);
    const url = `${this.APserver}/Api/UpdateSFC`;
    return this.http.post<UpdateSFCResponse>(url, body, { headers: this.headers });
  }

  public API_GetEmployeeDept(employeecode: string) {
    const myObj = {
      employeecode: employeecode
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/GetEmployeeDept",
        body, this.httpOptions).toPromise()
        .then(data => {
          resolve(data);
        })
        .catch((error: any) => {
          reject(false);
        });
    });
    return promise;
  }

  apiOutsourcedData(request: OutsourcedDataRequest): Observable<OutsourcedDataResponse> {
    const body = JSON.stringify(request);
    const url = `${this.APserver}/Api/OutsourcedData`;
    return this.http.post<OutsourcedDataResponse>(url, body, { headers: this.headers });
  }

  apiBatchSFCForOutsourced(request: BatchSFCForOutsourcedReqeust): Observable<BatchSFCForOutsourcedResponse> {
    const body = JSON.stringify(request);
    const url = `${this.APserver}/Api/BatchSFCForOutsourced`;
    return this.http.post<BatchSFCForOutsourcedResponse>(url, body, { headers: this.headers });
  }

  public API_ReportWorkingData(PorductionOrderHead: string, PorductionOrder: string) {
    const myObj = {
      PorductionOrderHead: PorductionOrderHead,
      PorductionOrder: PorductionOrder
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/ReportWorkingData",
        body, this.httpOptions).toPromise()
        .then(data => {
          resolve(data);
        })
        .catch((error: any) => {
          reject(false);
        });
    });
    return promise;
  }

  apiWorkingData(request: WorkingDataRequest): Observable<WorkingDataResponse> {
    const body = JSON.stringify(request);
    const url = `${this.APserver}/Api/WorkingData`;
    return this.http.post<WorkingDataResponse>(url, body, { headers: this.headers });
  }

  public API_UpdateScheduleFlask(PorductionOrderHead: string, PorductionOrder: string, FlaskID: string, BottomFlaskID: string, WIPProcessCode: string, Account: string) {
    const myObj = {
      PorductionOrderHead: PorductionOrderHead,
      PorductionOrder: PorductionOrder,
      FlaskID: FlaskID,
      BottomFlaskID: BottomFlaskID,
      WIPProcessCode: WIPProcessCode,
      Account: Account
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/UpdateScheduleFlask",
        body, this.httpOptions).toPromise()
        .then(data => {
          resolve(data);
        })
        .catch((error: any) => {
          reject(false);
        });
    });
    return promise;
  }
  public API_ChangeLineCOde(Account: string, CurrentLineCode: POstatus) {
    const myObj = {
      Account: Account,
      CurrentLineCode: CurrentLineCode
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/ChangeLineCOde",
        body, this.httpOptions).toPromise()
        .then(data => {
          resolve(data);
        })
        .catch((error: any) => {
          reject(false);
        });
    });
    return promise;
  }

  apiGetPrepareMoldList(request: GetPrepareMoldListRequest): Observable<GetPrepareMoldListResponse> {
    const body = JSON.stringify(request);
    const url = `${this.APserver}/Api/GetPrepareMoldList`;
    return this.http.post<GetPrepareMoldListResponse>(url, body, { headers: this.headers });
  }

  public API_EmbedReportUrl() {
    const myObj = {
      reportid: "123"
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/AddDashBoard?reportid=123",
        body, this.httpOptions).toPromise()
        .then(data => {
          resolve(data);
        })
        .catch((error: any) => {
          reject(false);
        });
    });
    return promise;
  }

  apiAddMoldRepairForm(request: FormData): Observable<BasicAPIResponse> {
    const url = `${this.APserver}/api/AddMoldRepairForm`;
    return this.http.post<BasicAPIResponse>(url, request);
  }

  apiMoldRepairFormInquire(request: MoldRepairFormInquireRequest): Observable<MoldRepairFormInquireResponse> {
    const url = `${this.APserver}/api/MoldRepairRecord`;
    const body = JSON.stringify(request);

    return this.http.post<MoldRepairFormInquireResponse>(url, body, { headers: this.headers });
  }

  apiMoldIdList(request: MoldIdListRequest): Observable<MoldIdListResponse> {
    const url = `${this.APserver}/api/MoldIDList`;
    const body = JSON.stringify(request);

    return this.http.post<MoldIdListResponse>(url, body, { headers: this.headers });
  }
  /**
   *取得線別標準產能列表
   *
   * @param {LineProdCapacityRequest} request
   * @return {*}  {Observable<LineProdCapacityResponse>}
   * @memberof ProdutionService
   */
  apiLineProdCapacity(request: LineProdCapacityRequest): Observable<LineProdCapacityResponse> {
    const url = `${this.APserver}/api/LineStandardCapacity?Account=${request.Account}&id=${request.id ? request.id : ''}&lineCode=${request.lineCode ? request.lineCode : ''}&capacity=${request.capacity ? request.capacity : ''}&affectDays=${request.affectDays ? request.affectDays : ''}`;
    return this.http.get<LineProdCapacityResponse>(url, { headers: this.headers });
  }
  /**
   *新增標準產能
   *
   * @param {AddLineStandardCapacityRequest} request
   * @return {*}  {Observable<AddLineStandardCapacityResponse>}
   * @memberof ProdutionService
   */
  apiAddLineStandardCapacity(request: AddLineStandardCapacityRequest): Observable<AddLineStandardCapacityResponse> {
    const body = JSON.stringify(request);
    const url = `${this.APserver}/api/LineStandardCapacity`;
    return this.http.post<AddLineStandardCapacityResponse>(url, body, { headers: this.headers });
  }
  /**
   *修改標準產能
   *
   * @param {AddLineStandardCapacityRequest} request
   * @return {*}  {Observable<BasicAPIResponse>}
   * @memberof ProdutionService
   */
  apiEditLineStandardCapacity(request: EditLineStandardCapacityRequest): Observable<BasicAPIResponse> {
    const body = JSON.stringify(request);
    const url = `${this.APserver}/api/UpdLineStandardCapacity`;
    return this.http.post<BasicAPIResponse>(url, body, { headers: this.headers });
  }

  apiDelLineStandardCapacity(request: DelLineStandardCapacityRequest): Observable<BasicAPIResponse> {
    const body = JSON.stringify(request);
    const url = `${this.APserver}/api/DelLineStandardCapacity`;
    return this.http.post<BasicAPIResponse>(url, body, { headers: this.headers });
  }
  /**
   *計算並且取得排程資料
   *
   * @param {CalculateLineProductionRequest} request
   * @return {*}  {Observable<CalculateLineProductionResponse>}
   * @memberof ProdutionService
   */
  apiCalculateLineProduction(request: CalculateLineProductionRequest): Observable<CalculateLineProductionResponse> {
    let requestString = '';
    Object.keys(request).forEach((i, index) => {
      if (index == 0) {
        requestString = `${i}=${request[i]}`;
      } else {
        requestString = `${requestString}&${i}=${request[i]}`;
      }
    });
    const url = `${this.APserver}/api/CalculateLineProduction?${requestString}`;
    return this.http.get<CalculateLineProductionResponse>(url, { headers: this.headers });
  }
  /**
   *取得排程資料列表
   *
   * @return {*}  {Observable<LineProductionScheduleListResponse>}
   * @memberof ProdutionService
   */
  apiLineProductionScheduleList(request: LineProductionScheduleListRequest): Observable<LineProductionScheduleListResponse> {
    const body = JSON.stringify(request);
    const url = `${this.APserver}/api/LineProductionScheduleList`;
    return this.http.post<LineProductionScheduleListResponse>(url, body, { headers: this.headers });
  }

  /**
   *取得排程資料列表
   *
   * @return {*}  {Observable<LineProductionScheduleListResponse>}
   * @memberof ProdutionService
   */
  apiLineLockedProductionScheduleList(request: LineProductionScheduleListRequest): Observable<LineProductionScheduleListResponse> {
    const body = JSON.stringify(request);
    const url = `${this.APserver}/api/LineLockedProductionScheduleList`;
    return this.http.post<LineProductionScheduleListResponse>(url, body, { headers: this.headers });
  }

  apiLockOrderSchedule(request: LockOrderScheduleRequest): Observable<BasicAPIResponse> {
    let requestString = '';
    Object.keys(request).forEach((i, index) => {
      if (index == 0) {
        requestString = `${i}=${request[i]}`;
      } else {
        requestString = `${requestString}&${i}=${request[i]}`;
      }
    });
    const url = `${this.APserver}/api/LockOrderSchedule?${requestString}`;
    return this.http.get<BasicAPIResponse>(url, { headers: this.headers });
  }

  /**
   *試算
   *
   * @param {RecalLineProdScheduleRequest} request
   * @return {*}  {Observable<BasicAPIResponse>}
   * @memberof MoService
   */
  apiRecalLineProdSchedule(request: RecalLineProdScheduleRequest): Observable<BasicAPIResponse> {
    const body = JSON.stringify(request);
    const url = `${this.APserver}/api/recalLineProdSchedule`;
    return this.http.post<BasicAPIResponse>(url, body, { headers: this.headers });
  }

}
