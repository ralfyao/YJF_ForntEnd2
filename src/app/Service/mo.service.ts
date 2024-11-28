import { RestfulRequester } from 'src/app/Service/RestfulRequester.service'
import { Injectable } from '@angular/core';
import { MaintainOrder, MaintainDetail, MaintainOrderList } from '../Model/vo';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MaintainListRequest } from 'src/bin/maintainListRequest';
import { MaintainListResponse } from 'src/bin/maintainListResponse';
import { QueryMatainRequestRequest } from 'src/bin/queryMatainRequestRequest';
import { QueryMatainRequestResponse } from 'src/bin/queryMatainRequestResponse';
import { ProblemListRequest } from 'src/bin/problemListRequest';
import { ProblemListResponse } from 'src/bin/problemListResponse';
import { UpdateMaintainOrderRequest } from 'src/bin/updateMaintainOrderRequest';
import { UpdateMaintainOrderResponse } from 'src/bin/updateMaintainOrderResponse';
import { PaymentTermListRequest } from 'src/bin/paymentTermListRequest';
import { PaymentTermListResponse } from 'src/bin/paymentTermListResponse';
import { QueryMatainorderRequest } from 'src/bin/queryMatainorderRequest';
import { QueryMatainorderResponse } from 'src/bin/queryMatainorderResponse';
import { QueryAssetListRequest } from 'src/bin/queryAssetListRequest';
import { QueryAssetListResponse } from 'src/bin/queryAssetListResponse';
import { SolutionCodeListReqeust } from 'src/bin/solutionCodeListReqeust';
import { SolutionCodeListResponse } from 'src/bin/solutionCodeListResponse';
import { TaxCodeListRequest } from 'src/bin/taxCodeListRequest';
import { TaxCodeListResponse } from 'src/bin/taxCodeListResponse';
import { ModifyMatainorderRequest } from 'src/bin/modifyMatainorderRequest';
import { ModifyMatainorderResponse } from 'src/bin/modifyMatainorderResponse';
import { ComApartmentListRequest } from 'src/bin/comApartmentListRequest';
import { ComApartmentListResponse } from 'src/bin/comApartmentListResponse';
/**保修單控制服務
 * @export MoService
 * @class MoService
 * @extends {RestfulRequester}
 */
@Injectable()
export class MoService extends RestfulRequester {

  /**
   *獲取保修單資料
   *
   * @param {MaintainListRequest} request
   * @return {*}  {Observable<MaintainListResponse>}
   * @memberof MoService
   */
  apiMaintainList(request: MaintainListRequest): Observable<MaintainListResponse> {
    const body = JSON.stringify(request);
    const url = `${this.APserver}/Api/MaintainList`;
    return this.http.post<MaintainListResponse>(url, body, { headers: this.headers })
  }

  /**
   *撈請修單列表
   *
   * @param {QueryMatainRequestRequest} request
   * @return {*}  {Observable<QueryMatainRequestResponse>}
   * @memberof MoService
   */
  apiQueryMatainRequest(request: QueryMatainRequestRequest): Observable<QueryMatainRequestResponse> {
    const body = JSON.stringify(request);
    const url = `${this.APserver}/Api/QueryMatainRequest`;
    return this.http.post<QueryMatainRequestResponse>(url, body, { headers: this.headers })
  }

  /**
   *撈交易條件清單
   *
   * @param {ProblemListRequest} request
   * @return {*}  {Observable<ProblemListResponse>}
   * @memberof MoService
   */
  apiProblemList(request: ProblemListRequest): Observable<ProblemListResponse> {
    const body = JSON.stringify(request);
    const url = `${this.APserver}/Api/ProblemList`;
    return this.http.post<ProblemListResponse>(url, body, { headers: this.headers })
  }

  /**
   *上傳保修單外修單
   *
   * @param {UpdateMaintainOrderRequest} request
   * @return {*}  {Observable<UpdateMaintainOrderResponse>}
   * @memberof MoService
   */
  apiUpdateMaintainOrder(request: UpdateMaintainOrderRequest): Observable<UpdateMaintainOrderResponse> {
    const body = JSON.stringify(request);
    const url = `${this.APserver}/Api/UpdateMaintainOrder`;
    return this.http.post<UpdateMaintainOrderResponse>(url, body, { headers: this.headers })
  }

  /**
   *撈交易條件清單
   *
   * @param {PaymentTermListRequest} request
   * @return {*}  {Observable<PaymentTermListResponse>}
   * @memberof MoService
   */
  apiPaymentTermList(request: PaymentTermListRequest): Observable<PaymentTermListResponse> {
    const body = JSON.stringify(request);
    const url = `${this.APserver}/Api/PaymentTermList`;
    return this.http.post<PaymentTermListResponse>(url, body, { headers: this.headers })
  }

  /**
   *撈整批保修與外修單據
   *
   * @param {QueryMatainorderRequest} request
   * @return {*}  {Observable<QueryMatainorderResponse>}
   * @memberof MoService
   */
  apiQueryMatainorder(request: QueryMatainorderRequest): Observable<QueryMatainorderResponse> {
    const body = JSON.stringify(request);
    const url = `${this.APserver}/Api/QueryMatainorder`;
    return this.http.post<QueryMatainorderResponse>(url, body, { headers: this.headers })
  }

  /**
   *撈處理清單
   *
   * @param {SolutionCodeListReqeust} request
   * @return {*}  {Observable<SolutionCodeListResponse>}
   * @memberof MoService
   */
  apiSolutionCodeList(request: SolutionCodeListReqeust): Observable<SolutionCodeListResponse> {
    const body = JSON.stringify(request);
    const url = `${this.APserver}/Api/SolutionCodeList`;
    return this.http.post<SolutionCodeListResponse>(url, body, { headers: this.headers })
  }

  /**
   *撈稅別碼清單
   *
   * @param {TaxCodeListRequest} request
   * @return {*}  {Observable<TaxCodeListResponse>}
   * @memberof MoService
   */
  apiTaxCodeList(request: TaxCodeListRequest): Observable<TaxCodeListResponse> {
    const body = JSON.stringify(request);
    const url = `${this.APserver}/Api/TaxCodeList`;
    return this.http.post<TaxCodeListResponse>(url, body, { headers: this.headers })
  }

  /**
   *更新回報單外修單
   *
   * @param {ModifyMatainorderRequest} request
   * @return {*}  {Observable<ModifyMatainorderResponse>}
   * @memberof MoService
   */
  apiModifyMatainorder(request: ModifyMatainorderRequest): Observable<ModifyMatainorderResponse> {
    const body = JSON.stringify(request);
    const url = `${this.APserver}/Api/ModifyMatainorder`;
    return this.http.post<ModifyMatainorderResponse>(url, body, { headers: this.headers })
  }

  /**
   *撈資產資料列表
   *
   * @param {ComApartmentListRequest} request
   * @return {*}  {Observable<ComApartmentListResponse>}
   * @memberof MoService
   */
  apiComApartmentList(request: ComApartmentListRequest): Observable<ComApartmentListResponse> {
    const body = JSON.stringify(request);
    const url = `${this.APserver}/Api/ComApartmentList`;
    return this.http.post<ComApartmentListResponse>(url, body, { headers: this.headers })
  }


  /**
   *撈資產資料列表
   *
   * @param {QueryAssetListRequest} request
   * @return {*}  {Observable<QueryAssetListResponse>}
   * @memberof MoService
   */
  apiQueryAssetList(request: QueryAssetListRequest): Observable<QueryAssetListResponse> {
    const body = JSON.stringify(request);
    const url = `${this.APserver}/Api/QueryAssetList`;
    return this.http.post<QueryAssetListResponse>(url, body, { headers: this.headers })
  }

  /**撈保修單細節資料列表
   * @param DocumentType ：保修單別
   * @param DocumentNumber ：保修單號
   */
  public API_Query_MODetailList(DocumentType: string, DocumentNumber: string): Promise<Array<MaintainDetail>> {
    const myObj = {
      DocumentType: DocumentType,
      DocumentNumber: DocumentNumber
    };
    let body = JSON.stringify(myObj);
    let promise: Promise<Array<MaintainDetail>> = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/MaintainDetailList",
        body, this.httpOptions).toPromise()
        .then(data => {
          let ary: Array<MaintainDetail> = new Array<MaintainDetail>();
          let eleary: Array<any> = Array.of(data);
          for (let index = 0; index < eleary[0]['MaintainDetailReps'].length; index++) {
            let value: MaintainDetail = new MaintainDetail();
            value.ActualDate = eleary[0]['MaintainDetailReps'][index]['ActualDate'];
            value.ActualEndDate = eleary[0]['MaintainDetailReps'][index]['ActualEndDate'];
            value.ActualHours = eleary[0]['MaintainDetailReps'][index]['ActualHours'];
            value.ExpectedDate = eleary[0]['MaintainDetailReps'][index]['ExpectedDate'];
            value.ExpectedEndDate = eleary[0]['MaintainDetailReps'][index]['ExpectedEndDate'];
            value.ExpectedHours = eleary[0]['MaintainDetailReps'][index]['ExpectedHours'];
            value.MaintainAmount = eleary[0]['MaintainDetailReps'][index]['MaintainAmount'];
            value.Name = eleary[0]['MaintainDetailReps'][index]['Name'];
            value.Reason = eleary[0]['MaintainDetailReps'][index]['Reason'];
            value.MaintainCode = eleary[0]['MaintainDetailReps'][index]['MaintainCode'];
            value.Remark = eleary[0]['MaintainDetailReps'][index]['Remark'];
            value.RepairPersonCount = eleary[0]['MaintainDetailReps'][index]['RepairPersonCount'];
            value.SerialNumber = eleary[0]['MaintainDetailReps'][index]['SerialNumber'];
            value.Solution = eleary[0]['MaintainDetailReps'][index]['Solution'];
            value.TQ008 = eleary[0]['MaintainDetailReps'][index]['TQ008'];
            value.TQ009 = eleary[0]['MaintainDetailReps'][index]['TQ009'];
            value.TQ011 = eleary[0]['MaintainDetailReps'][index]['TQ011'];
            value.TQ012 = eleary[0]['MaintainDetailReps'][index]['TQ012'];
            value.TQ013 = eleary[0]['MaintainDetailReps'][index]['TQ013'];
            value.TQ014 = eleary[0]['MaintainDetailReps'][index]['TQ014'];
            value.UDF01 = eleary[0]['MaintainDetailReps'][index]['UDF01'];
            value.UDF02 = eleary[0]['MaintainDetailReps'][index]['UDF02'];
            ary.push(value);
          }
          resolve(ary);
        })
        .catch((error: HttpErrorResponse) => {
          reject(error);
        });
    });
    return promise;
  }

  public API_Update_MODetailList(Order: MaintainOrder, LoginAccount: string) {
    const myObj = {
      DocumentType: Order.DocumentType,
      DocumentNumber: Order.DocumentNumber,
      LoginAccount: LoginAccount,
      MaintainDetailReqs: Order.MaintainDetailReps
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/MaintainSetting",
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

  /**上傳保單細節資料列表
   * @param fromData 保單附件資料表單資料「uploadFiles:檔案、DocumentType：單別、DocumentNumber：單號、SerialNumber：維修序號」
   */
  public API_Upload_MODetailAttachFile(fromData: FormData) {
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/MaintainUploadFile",
        fromData, this.ftpOptions).toPromise()
        .then(data => {
          resolve(data);
        })
        .catch((error: any) => {
          reject(false);
        });
    });
    return promise;
  }

  /**
   * 查保修單附件列表
   * @param DocumentType 保修單別
   * @param DocumentNumber 保修單號
   */
  public API_Query_MODetailAttachList(DocumentType: string, DocumentNumber: string) {
    const myObj = {
      DocumentType: DocumentType,
      DocumentNumber: DocumentNumber
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/MaintainAnnexList",
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
  /**
   * 刪除保修單附件
   * @param AnnexID 保修單附件ID
   * @param LoginAccount 操作帳號
   */
  public API_Delete_MODetailAttach(AnnexID: string, LoginAccount: string) {
    const myObj = {
      FORM_MaintainAnnexMap_ID: AnnexID,
      LoginAccount: LoginAccount
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/DeleteMaintainAnnex",
        body, this.httpOptions).toPromise()
        .then(data => {
          resolve(data);
        })
        .catch((error: HttpErrorResponse) => {
          reject(error);
        });
    });
    return promise;
  }

  /*更新保修單單身資料 */
  public API_Update_MODetail(detail: MaintainDetail, DocumentType: string, DocumentNumber: string) {
    const myObj = {
      DocumentType: DocumentType,
      DocumentNumber: DocumentNumber,
      SerialNumber: detail.SerialNumber,
      MaintainCode: detail.MaintainCode,
      Name: detail.Name,
      Reason: detail.Reason,
      Solution: detail.Solution,
      ExpectedHours: detail.ExpectedHours,
      ExpectedDate: detail.ExpectedDate,
      ExpectedEndDate: detail.ExpectedEndDate,
      ActualDate: detail.ActualDate,
      ActualEndDate: detail.ActualEndDate,
      ActualHours: detail.ActualHours,
      MaintainAmount: detail.MaintainAmount,
      RepairPersonCount: detail.RepairPersonCount,
      Remark: detail.Remark,
      TQ008: detail.TQ008,
      TQ009: detail.TQ009,
      TQ011: detail.TQ011,
      TQ012: detail.TQ012,
      TQ013: detail.TQ013,
      TQ014: detail.TQ014,
      UDF01: detail.UDF01,
      UDF02: detail.UDF02
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/api/UpdateMaintain",
        body, this.httpOptions).toPromise()
        .then(data => {
          resolve(data);
        })
        .catch((error: HttpErrorResponse) => {
          reject(error);
        });
    });
    return promise;
  }

  /**新增保修單單身*/
  public API_Insert_MODetail(detail: MaintainDetail, DocumentType: string, DocumentNumber: string) {
    const myObj = {
      DocumentType: DocumentType,
      DocumentNumber: DocumentNumber,
      SerialNumber: detail.SerialNumber,
      MaintainCode: detail.MaintainCode,
      Name: detail.Name,
      Reason: detail.Reason,
      Solution: detail.Solution,
      ExpectedHours: detail.ExpectedHours,
      ExpectedDate: detail.ExpectedDate,
      ExpectedEndDate: detail.ExpectedEndDate,
      ActualDate: detail.ActualDate,
      ActualEndDate: detail.ActualEndDate,
      ActualHours: detail.ActualHours,
      MaintainAmount: detail.MaintainAmount,
      RepairPersonCount: detail.RepairPersonCount,
      Remark: detail.Remark,
      TQ008: detail.TQ008,
      TQ009: detail.TQ009,
      TQ011: detail.TQ011,
      TQ012: detail.TQ012,
      TQ013: detail.TQ013,
      TQ014: detail.TQ014,
      UDF01: detail.UDF01,
      UDF02: detail.UDF02
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/api/AddMaintain",
        body, this.httpOptions).toPromise()
        .then(data => {
          resolve(data);
        })
        .catch((error: HttpErrorResponse) => {
          reject(error);
        });
    });
    return promise;
  }

}
