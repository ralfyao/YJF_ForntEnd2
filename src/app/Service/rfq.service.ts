
import { RestfulRequester } from 'src/app/Service/RestfulRequester.service'
import { QuotationDetail, ClosedQuotationResult, SupplierQuotationRecord, ResultQuoteLog, FinalQuotationLog, FileBatchList } from 'src/app/Model/vo'
import { Observable } from 'rxjs';
import { HttpEvent, HttpRequest } from '@angular/common/http';
import { SessionStorageService } from 'ngx-webstorage';
import { Injectable } from "@angular/core";
import { SmartSearchSupplierQuoteStatusListRequest } from 'src/bin/smartSearchSupplierQuoteStatusListRequest';
import { SmartSearchSupplierQuoteStatusListResponse } from 'src/bin/smartSearchSupplierQuoteStatusListResponse';
import { AllSmartSearchSupplierQuoteStatusListRequest } from 'src/bin/allSmartSearchSupplierQuoteStatusListRequest';
import { AllSmartSearchSupplierQuoteStatusListResponse } from 'src/bin/allSmartSearchSupplierQuoteStatusListResponse';
import { RFQAttachListRequest } from 'src/bin/rFQAttachListRequest';
import { RFQAttachListResponse } from 'src/bin/rFQAttachListResponse';
import { QuerySingleQuotationDetailRequest } from 'src/bin/querySingleQuotationDetailRequest';
import { QuerySingleQuotationDetailResponse } from 'src/bin/querySingleQuotationDetailResponse';
import { SupplierAttachAllListReqeust } from 'src/bin/supplierAttachAllListReqeust';
import { SupplierAttachAllListResponse } from 'src/bin/supplierAttachAllListResponse';
import { SingleSupplierQuoteLogListRequest } from 'src/bin/singleSupplierQuoteLogListRequest';
import { SingleSupplierQuoteLogListResponse } from 'src/bin/singleSupplierQuoteLogListResponse';
import { QueryQuotationDetailListRequest } from 'src/bin/queryQuotationDetailListRequest';
import { QueryQuotationDetailListResponse } from 'src/bin/queryQuotationDetailListResponse';
import { QueryQuoteTypeListRequest } from 'src/bin/queryQuoteTypeListRequest';
import { QueryQuoteTypeListResponse } from 'src/bin/queryQuoteTypeListResponse';
import { AddQuotationRequest } from 'src/bin/addQuotationRequest';
import { AddQuotationResponse } from 'src/bin/addQuotationResponse';
import { BasicAPIResponse } from 'src/bin/basicAPIResponse';
import { UpdateQuotationDetailRequest } from 'src/bin/updateQuotationDetailRequest';
import { BatchUpdateQuotationDetailRequest } from 'src/bin/batchUpdateQuotationDetailRequest';
import { BatchUpdateQuotationDetailResponse } from 'src/bin/batchUpdateQuotationDetailResponse';
import { SupplierQuotationDetailListRequest } from 'src/bin/supplierQuotationDetailListRequest';
import { SupplierQuotationDetailListResponse } from 'src/bin/supplierQuotationDetailListResponse';




@Injectable()
export class RFQService extends RestfulRequester {

  private session: SessionStorageService
  super(session: SessionStorageService) {
    this.session = session;
  }

  //#region 詢價單


  /**
   *新增詢價單頭
   *
   * @param {AddQuotationRequest} request
   * @return {*}  {Observable<AddQuotationResponse>}
   * @memberof RFQService
   */
  apiAddQuotation(request: AddQuotationRequest): Observable<AddQuotationResponse> {
    const body = JSON.stringify(request);
    const url = `${this.APserver}/Api/AddQuotation`;

    return this.http.post<AddQuotationResponse>(url, body, { headers: this.headers })
  }


  apiBatchUpdateQuotationDetail(request: BatchUpdateQuotationDetailRequest): Observable<BatchUpdateQuotationDetailResponse> {
    const body = JSON.stringify(request);
    const url = `${this.APserver}/Api/BatchUpdateQuotationDetail`;
    return this.http.post<BatchUpdateQuotationDetailResponse>(url, body, { headers: this.headers })
  }


  /** 查詢供應商該報的項目
   * @param USR_Supplier_ID 供應商ID
   */
  public API_AllSupplierQuotationDetailList(USR_Supplier_ID: string, FORM_SupplierQuote_ID: number) {
    const myObj = {
      USR_Supplier_ID: USR_Supplier_ID,
      FORM_SupplierQuote_ID: FORM_SupplierQuote_ID
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/AllSupplierQuotationDetailList",
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

  public API_Query_MemberList(ListCount: string, PageNumber: string) {
    const myObj = {
      ListCount: ListCount,
      PageNumber: PageNumber
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/AccountManagementList",
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

  /** 新增品項單中的詢價廠商列表
   * @param FORM_QuotationDetail_ID ＊品號單ID
   * @param USR_Supplier_ID ＊廠商ID
   * @param Adder ＊操作人帳號
   */
  public API_Insert_QuotationDetailVendor(FORM_QuotationDetail_ID: string, USR_Supplier_ID: string, Adder: string) {
    const myObj = {
      FORM_QuotationDetail_ID: FORM_QuotationDetail_ID,
      USR_Supplier_ID: USR_Supplier_ID,
      LoginAccount: Adder
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/AddQuotationDetailSupplier",
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

  /**移除品項單中的詢價廠商列表
   * @param FORM_QuotationDetailSupplierMap_ID ＊品號單廠商對應ID
   * @param Adder ＊操作人帳號
   */
  public API_Delete_QuotationDetailVendor(FORM_QuotationDetailSupplierMap_ID: string, Adder: string) {
    const myObj = {
      FORM_QuotationDetailSupplierMap_ID: FORM_QuotationDetailSupplierMap_ID,
      LoginAccount: Adder
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/DeleteQuotationDetailSupplier",
        body, this.httpOptions).toPromise()
        .then(data => {
          resolve(data);
        })
        .catch((error: any) => {
          reject(false)
        });
    });
    return promise;
  }

  /** 撈詢價單資料
   * @param ListCount：列表X筆數(一次要列幾筆=X)
   * @param PageNumber：列表第幾頁(每頁X筆的第幾頁)
   */
  public API_SearchText(SearchText: string, CreateDate_Start: string, CreateDate_End: string, QStatus: string, Page: number, ListCount: number, UserAccount: string) {
    const myObj = {
      SearchText: SearchText,
      CreateDate_Start: CreateDate_Start,
      CreateDate_End: CreateDate_End,
      QStatus: QStatus,
      UserAccount: UserAccount,
      Page: Page,
      ListCount: ListCount
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/SmartSearchQM",
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

  /** 撈詢價單資料
   * @param ListCount：列表X筆數(一次要列幾筆=X)
   * @param PageNumber：列表第幾頁(每頁X筆的第幾頁)
   */
  public API_Query_QuotationList(YJFCustomerNumber: string, QuoteNumber: string, CreateByName: string, QStatus: string, CreateDate_Start: string,
    CreateDate_End: string, ListCount: string, PageNumber: string) {
    const myObj = {
      YJFCustomerNumber: YJFCustomerNumber,
      QuoteNumber: QuoteNumber,
      CreateByName: CreateByName,
      QStatus: QStatus,
      CreateDate_Start: CreateDate_Start,
      CreateDate_End: CreateDate_End,
      ListCount: ListCount,
      PageNumber: PageNumber
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/QuotationList",
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

  /**查單張報價單資料
   * @param Quotation_ID 詢價單(報價單)ID
   */
  public API_Query_SingleQuotation(Quotation_ID: string) {
    const myObj = {
      FORM_Quotation_ID: Quotation_ID
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/SingleQuotation",
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

  /**查單張報價單資料
   * @param Quotation_ID 詢價單(報價單)ID
   */
  public API_SendReqToSupplier(SendList: Array<string>) {
    const myObj = {
      SendList: SendList
    };

    let body = JSON.stringify(myObj);

    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/SendReqToSupplier",
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

  public API_ResultQuotationList(FORM_Quotation_ID: string) {
    const myObj = {
      FORM_Quotation_ID: FORM_Quotation_ID
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/ResultQuotationList",
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
   *查單張報價單裡面的詳細資料
   *
   * @param {QueryQuotationDetailListRequest} request
   * @return {*}  {Observable<QueryQuotationDetailListResponse>}
   * @memberof RFQService
   */
  apiQueryQuotationDetailListRequest(request: QueryQuotationDetailListRequest): Observable<QueryQuotationDetailListResponse> {
    const url = `${this.APserver}/Api/QuotationDetailList`;
    const body = JSON.stringify(request);

    return this.http.post<QueryQuotationDetailListResponse>(url, body, { headers: this.headers })
  }

  /**
   *查報價種類資料
   *
   * @param {QueryQuoteTypeListRequest} request
   * @return {*}  {Observable<QueryQuoteTypeListResponse>}
   * @memberof RFQService
   */
  apiQueryQuoteTypeList(request: QueryQuoteTypeListRequest): Observable<QueryQuoteTypeListResponse> {
    const body = JSON.stringify(request);
    const url = `${this.APserver}/Api/QuoteTypeList`;
    return this.http.post<QueryQuoteTypeListResponse>(url, body, { headers: this.headers })
  }

  /**新增詢價單品項
   * @param detail 詢價單品項VO
   * @param Adder 新增人帳號
   */
  public API_Insert_AddQuotationDetail(detail: QuotationDetail, Adder: string) {
    const myObj = {
      FORM_Quotation_ID: detail.FORM_QuotationDetail_ID,
      QuoteItemNumber: detail.QuoteItemNumber,
      CastingWeight: detail.CastingWeight,
      CastingMaterial: detail.CastingMaterial,
      CastingSize: detail.CastingSize,
      EstimateQuantity: detail.EstimateQuantity,
      SYS_QuoteType_ID: detail.SYS_QuoteType_ID,
      LoginAccount: Adder,
      QuoteRemark: detail.QuoteRemark
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/AddQuotationDetail",
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

  /**刪除詢價單
   * @param FORM_Quotation_ID 詢價單ID
   * @param Adder 刪除人帳號
   */
  public API_Delete_Quotation(FORM_Quotation_ID: string, Adder: string) {
    const myObj = {
      FORM_Quotation_ID: FORM_Quotation_ID,
      UserAccount: Adder
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/DeleteQuotation",
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

  /**刪除詢價單品項
   * @param FORM_QuotationDetail_ID 報價單品項編號
   * @param Adder 刪除者帳號
   */
  public API_Delete_QuotationDetail(FORM_QuotationDetail_ID: string, Adder: string) {
    const myObj = {
      FORM_QuotationDetail_ID: FORM_QuotationDetail_ID,
      LoginAccount: Adder
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/DeleteQuotationDetail",
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

  /**查詢系統廠商列表
   * @param SupplierName 廠商名稱(關鍵字-未KEY就是全部)
   * @param ListCount 每頁幾筆
   * @param PageNumber 第幾頁
   */
  public API_Query_SupplierList(SupplierName: string, ListCount: string, PageNumber: string) {
    const myObj = {
      SupplierName: SupplierName,
      ListCount: ListCount,
      PageNumber: PageNumber
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/SupplierList",
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

  /**查詢品項中的負責廠商
   * @param FORM_QuotationDetail_ID 報價單品項ID
   */
  public API_Query_SupplierMailList(FORM_Quotation_ID: string) {
    const myObj = {
      FORM_Quotation_ID: FORM_Quotation_ID
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/SupplierMailList",
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


  /**查詢品項中的負責廠商
   * @param FORM_QuotationDetail_ID 報價單品項ID
   */
  public API_Query_RFQDetailSupplier(FORM_QuotationDetail_ID: string) {
    const myObj = {
      FORM_QuotationDetail_ID: FORM_QuotationDetail_ID
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/AssignSupplierList",
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
  /** 查詢品項單附件列表
   * @param FORM_QuotationDetailSupplierMap_ID 品號單-廠商對應ID
   * @param ListCount 每頁幾筆
   * @param PageNumber 第幾頁
   */
  public API_Query_SupplierAttachNewestList(FORM_QuotationDetail_ID: string, USR_Supplier_ID: string) {
    const myObj = {
      FORM_QuotationDetail_ID: FORM_QuotationDetail_ID,
      USR_Supplier_ID: USR_Supplier_ID
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/QuotationDetailAnnexList",
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
   *查詢品項單附件列表
   *
   * @param {SupplierAttachAllListReqeust} request
   * @return {*}  {Observable<SupplierAttachAllListResponse>}
   * @memberof RFQService
   */
  apiSupplierAttachAllList(request: SupplierAttachAllListReqeust):
    Observable<SupplierAttachAllListResponse> {
    const body = JSON.stringify(request);
    const url = `${this.APserver}/Api/QuotationDetailAnnexList`;

    return this.http.post<SupplierAttachAllListResponse>(url, body, { headers: this.headers })
  }
  /**
   *查詢詢價單附件列表
   *
   * @param {RFQAttachListRequest} request
   * @return {*}  {Observable<RFQAttachListResponse>}
   * @memberof RFQService
   */
  apiRFQAttachList(request: RFQAttachListRequest): Observable<RFQAttachListResponse> {
    const body = JSON.stringify(request);
    const url = `${this.APserver}/Api/QuotationAnnexList`;

    return this.http.post<RFQAttachListResponse>(url, body, { headers: this.headers })
  }

  public API_FileBatchSyncStatus(Flist: Array<FileBatchList>, FORM_QuotationDetail_ID: number) {
    const myObj = {
      Flist: Flist,
      FORM_QuotationDetail_ID: FORM_QuotationDetail_ID
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/FileSyncStatus",
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

  public API_FileBatchUpload(Flist: Array<FileBatchList>, FORM_QuotationDetail_ID: number, AccountID: number) {
    const myObj = {
      Flist: Flist,
      FORM_QuotationDetail_ID: FORM_QuotationDetail_ID,
      AccountID: AccountID
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/FileBatchUpload",
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

  /**送內部審核信
   * @param FORM_Quotation_ID 報價單ID
   * @param LoginAccount 操作帳號
   */
  public API_InternalAudit(FORM_Quotation_ID: number, MailTo: number) {
    const myObj = {
      FORM_Quotation_ID: FORM_Quotation_ID,
      MailTo: MailTo
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/InternalAudit",
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

  /**刪除報價單附件
   * @param FORM_QuotationAnnexMap_ID 報價單附件ID
   * @param LoginAccount 操作帳號
   */
  public API_Delete_RFQAttach(FORM_QuotationAnnexMap_ID: string, LoginAccount: string) {
    const myObj = {
      FORM_QuotationAnnexMap_ID: FORM_QuotationAnnexMap_ID,
      LoginAccount: LoginAccount
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/DeleteQuotationAnnex",
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

  /**上傳品項附件
   * @param fromData 品項附件表單資料
   */
  public API_Upload_RFQDetailUploadAttach(fromData: FormData): Observable<HttpEvent<any>> {
    const req = new HttpRequest('POST', this.APserver + "/Api/QuotationDetailAnnexUploadFile", fromData, {
      reportProgress: true,
    });
    return this.http.request(req);
  }

  /** 上傳詢價單附件
   * @param fromData 品項附件表單資料
   */
  public API_Upload_RFQUploadAttach(fromData: FormData): Observable<HttpEvent<any>> {
    const req = new HttpRequest('POST', this.APserver + "/Api/QuotationAnnexUploadFile", fromData, {
      reportProgress: true,
    });
    return this.http.request(req);
  }

  /**更新報價單品項資料
   *
   *
   * @param {UpdateQuotationDetailRequest} request
   * @return {*}  {Observable<BasicAPIResponse>}
   * @memberof RFQService
   */
  apiUpdateQuotationDetail(request: UpdateQuotationDetailRequest): Observable<BasicAPIResponse> {
    const body = JSON.stringify(request);
    const url = `${this.APserver}/Api/UpdateQuotationDetail`;

    return this.http.post<BasicAPIResponse>(url, body, { headers: this.headers })
  }

  //#endregion

  //#region 詢價回饋

  /** 撈廠商的詢價回饋項目
   * @param StartDate 建檔起始日期(選填)
   * @param EndDate 建檔結束日期(選填)
   * @param ListCount 每頁幾筆
   * @param PageNumber 第幾頁
   * @param USR_Supplier_ID 廠商ID
   */
  public API_Query_MOFeedBackList(SearchText: string, USR_Supplier_ID: string, ListCount: string, PageNumber: string, Status: string) {
    const myObj = {
      ListCount: ListCount,
      PageNumber: PageNumber,
      Status: Status,
      USR_Supplier_ID: USR_Supplier_ID,
      SearchText: SearchText

    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/SupplierQuotationDetailList",
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

  apiSupplierQuotationDetailList(request: SupplierQuotationDetailListRequest): Observable<SupplierQuotationDetailListResponse> {
    const body = JSON.stringify(request);
    const url = `${this.APserver}/Api/SupplierQuotationDetailList`;
    return this.http.post<SupplierQuotationDetailListResponse>(url, body, { headers: this.headers })
  }


  apiQuerySingleQuotationDetail(request: QuerySingleQuotationDetailRequest): Observable<QuerySingleQuotationDetailResponse> {
    const body = JSON.stringify(request);
    const url = `${this.APserver}/Api/QuerySingleQuotationDetail`;

    return this.http.post<QuerySingleQuotationDetailResponse>(url, body, { headers: this.headers })
  }

  public API_QueryLogByFORM_SupplierQuote_ID(FORM_SupplierQuote_ID: number, USR_Supplier_ID: string) {
    const myObj = {
      FORM_SupplierQuote_ID: FORM_SupplierQuote_ID,
      USR_Supplier_ID: USR_Supplier_ID
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/QueryLogByFORM_SupplierQuote_ID",
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

  public API_InsertSupplierQuotationRecordList(SupplierQuoteRecord: SupplierQuotationRecord) {
    const myObj = {
      FORM_QuotationDetail_ID: SupplierQuoteRecord.FORM_QuotationDetail_ID,
      UserAccount: SupplierQuoteRecord.UserAccount,
      QuotePrice: SupplierQuoteRecord.QuotePrice,
      QuoteRemark: SupplierQuoteRecord.QuoteRemark,
      CreateBy: SupplierQuoteRecord.CreateBy,
      QuoteItem: SupplierQuoteRecord.QuoteItem,
      QuoteQty: SupplierQuoteRecord.QuoteQty,
      QuoteWeightPrice: SupplierQuoteRecord.QuoteWeightPrice,
      QuoteUnitPrice: SupplierQuoteRecord.QuoteUnitPrice,
      USR_Supplier_ID: SupplierQuoteRecord.USR_Supplier_ID,
      FORM_SupplierQuote_ID: SupplierQuoteRecord.FORM_SupplierQuote_ID
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/AddSupplierRecordQuotationList",
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

  public API_InsertSupplierQuotationRecord(SupplierQuoteRecord: SupplierQuotationRecord) {
    const myObj = {
      FORM_QuotationDetail_ID: SupplierQuoteRecord.FORM_QuotationDetail_ID,
      UserAccount: SupplierQuoteRecord.UserAccount,
      QuotePrice: SupplierQuoteRecord.QuotePrice,
      QuoteRemark: SupplierQuoteRecord.QuoteRemark,
      CreateBy: SupplierQuoteRecord.CreateBy,
      QuoteItem: SupplierQuoteRecord.QuoteItem,
      QuoteQty: SupplierQuoteRecord.QuoteQty,
      QuoteWeightPrice: SupplierQuoteRecord.QuoteWeightPrice,
      QuoteUnitPrice: SupplierQuoteRecord.QuoteUnitPrice,
      USR_Supplier_ID: SupplierQuoteRecord.USR_Supplier_ID
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/AddSupplierRecordQuotation",
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




  public API_Query_FeedbackLogList(FORM_QuotationDetail_ID: string, USR_Supplier_ID: string) {
    const myObj = {
      FORM_QuotationDetail_ID: FORM_QuotationDetail_ID,
      USR_Supplier_ID: USR_Supplier_ID
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/SupplierQuotationRecordList",
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

  /** 修改廠商報價
   * @param FORM_QuotationDetailSupplierMap_ID ＊品號單廠商對應ID
   * @param QuotePrice ＊金額
   * @param QuoteRemark 備註
   * @param Adder ＊修改人帳號
   */
  public API_Update_MOFeedBack(FORM_QuotationDetailSupplierMap_ID: string, QuotePrice: string, QuoteRemark: string, Adder: string) {
    const myObj = {
      FORM_QuotationDetailSupplierMap_ID: FORM_QuotationDetailSupplierMap_ID,
      QuotePrice: QuotePrice,
      QuoteRemark: QuoteRemark,
      LoginAccount: Adder
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/UpdateQuotationDetailSupplier",
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
  public API_Delete_SupplierRecord(LOG_SupplierQuotationRecord_ID: number) {
    const myObj = {
      LOG_SupplierQuotationRecord_ID: LOG_SupplierQuotationRecord_ID
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/DeleteSupplierRecordQuotation",
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

  public API_Delete_SupplierAttach(FORM_QuotationDetailAnnexMap_ID: string, USR_Supplier_ID: string) {
    const myObj = {
      FORM_QuotationDetailAnnexMap_ID: FORM_QuotationDetailAnnexMap_ID,
      USR_Supplier_ID: USR_Supplier_ID
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/DeleteSupplierAttach",
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

  //#endregion

  //#region 報價成果結單

  apiSmartSearchSupplierQuoteStatusList(request: SmartSearchSupplierQuoteStatusListRequest): Observable<SmartSearchSupplierQuoteStatusListResponse> {
    const body = JSON.stringify(request);
    const url = `${this.APserver}/Api/SupplierQuoteStatusList`;

    return this.http.post<SmartSearchSupplierQuoteStatusListResponse>(url, body, { headers: this.headers })

  }

  //#region 報價成果結單

  apiAllSmartSearchSupplierQuoteStatusList(request: AllSmartSearchSupplierQuoteStatusListRequest): Observable<AllSmartSearchSupplierQuoteStatusListResponse> {
    const body = JSON.stringify(request);
    const url = `${this.APserver}/Api/AllSupplierQuoteStatusList`;

    return this.http.post<AllSmartSearchSupplierQuoteStatusListResponse>(url, body, { headers: this.headers })
  }



  /** 報價結單清單
   * @param QuoteNumber  報價編號
   * @param CreateByName  建立者
   * @param ListCount ＊列表筆數
   * @param PageNumber ＊列表第幾頁
   */
  public API_Query_QuotationResultList(QuoteNumber: string, CreateByName: string, Search_CSTName: string, QuotationIsClosedNumber: string, ListCount: string, PageNumber: string) {
    const myObj = {
      QuoteNumber: QuoteNumber,
      CreateByName: CreateByName,
      Search_CSTName: Search_CSTName,
      QuotationIsClosedNumber: QuotationIsClosedNumber,
      ListCount: ListCount,
      PageNumber: PageNumber
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/QuotationResultList",
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

  public API_QueryFinalQuotationLog(FORM_Quotation_ID: number, UserAccount: string) {
    const myObj = {
      FORM_Quotation_ID: FORM_Quotation_ID,
      UserAccount: UserAccount

    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/QueryFinalQuotationLog",
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
   * 更新源潤豐報價系統COPTA&COPTB
   * @param FinalQuotationList
   * @param UserAccount
   */
  public API_UpdateYJFQuotationSQL(FinalQuotationList: Array<FinalQuotationLog>, UserAccount: string) {
    const myObj = {
      FinalQuotationList: FinalQuotationList,
      UserAccount: UserAccount

    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/UpdateYJFQuotationSQL",
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
   * 直接結案報價單
   * @param FORM_Quotation_ID
   * @param UserAccount
   */
  public API_CloseQuotation(FORM_Quotation_ID: string, UserAccount: string) {
    const myObj = {
      FORM_Quotation_ID: FORM_Quotation_ID,
      UserAccount: UserAccount

    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/CloseQuotation",
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


  /**查詢報價溢價比結果細節
   * @param 查詢源潤豐品號
   */
  public API_QueryFORM_QuotationResultLog(FORM_Quotation_ID: number, Page: number, PageCount: number, UserAccount: string) {
    const myObj = {
      FORM_Quotation_ID: FORM_Quotation_ID,
      Page: Page,
      PageCount: PageCount,
      UserAccount: UserAccount

    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/QueryFORM_QuotationResultLog",
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





  /**查詢源潤豐品號
   * @param 查詢源潤豐品號
   */
  public API_UpdateFORM_QuotationResultLog(ResultQyoteLogList: Array<ResultQuoteLog>, UserAccount) {
    const myObj = {
      ResultQyoteLogList: ResultQyoteLogList,
      UserAccount: UserAccount

    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/UpdateFORM_QuotationResultLog",
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

  /**查詢源潤豐品號
   * @param 查詢源潤豐品號
   */
  public API_YJFSystemPartNoList(PartNo: string, Partdesc: string) {
    const myObj = {
      PartNo: PartNo,
      Partdesc: Partdesc
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/YJFSystemPartNoList",
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




  /**查報價結單匯率
   * @param SelectCurrency 選擇的貨幣
   */
  public API_Query_GlobalCurrency(SelectCurrency: string) {
    const myObj = {
      Currency: SelectCurrency
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/ExchangeRate",
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

  apiSingleSupplierQuoteLogList(
    request: SingleSupplierQuoteLogListRequest):
    Observable<SingleSupplierQuoteLogListResponse> {
    const body = JSON.stringify(request);
    const url = `${this.APserver}/Api/ResultSingleSupplierQuoteLog`;

    return this.http.post<SingleSupplierQuoteLogListResponse>(url, body, { headers: this.headers })
  }


  public API_Query_SupplierQuoteLogList(FORM_QuotationDetail_ID: number, LoginAccount: string) {
    const myObj = {
      FORM_QuotationDetail_ID: FORM_QuotationDetail_ID,
      UserAccount: LoginAccount
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/ResultSupplierQuoteLog",
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

  /**查詢有對品項報價的廠商
   * @param selectDetail 品項VO
   * @param ListCount ＊列表筆數
   * @param PageNumber ＊列表第幾頁
   */
  public API_Query_detailVendorList(selectDetail: ClosedQuotationResult) {
    const myObj = {
      FORM_QuotationDetail_ID: selectDetail.FORM_QuotationDetail_ID
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/StatementSupplierList",
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

  /**查單筆報價品號細節
   * @param FORM_Quotation_ID  報價品號ID
   */
  public API_Query_ClosedQuotationResultList(FORM_Quotation_ID: string) {
    const myObj = {
      FORM_Quotation_ID: FORM_Quotation_ID
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/ClosedQuotationResultList",
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
   * 新增結單
   * @param Result 品號報價單VO
   * @param USR_Supplier_ID ＊廠商ID
   * @param QuoteStatusType ＊報價狀態種類 1.供應商報價2.自行報價
   * @param Adder 新增人
   * @param Currency ＊幣別
   * @param ExchangeRate ＊匯率
   * @param WeightPrice ＊單重計價
   * @param UnitPrice ＊單價
   * @param ProfitRatio ＊利潤比
   * @param Remark 備註
   */
  public API_Insert_QuotationResult(Result: ClosedQuotationResult, USR_Supplier_ID: string, QuoteStatusType: string, Adder: string, Currency: string,
    ExchangeRate: string, WeightPrice: string, UnitPrice: string, ProfitRatio: string, Remark: string) {
    const myObj = {
      FORM_QuotationDetail_ID: Result.FORM_QuotationDetail_ID,
      USR_Supplier_ID: USR_Supplier_ID,
      QuoteStatusType: QuoteStatusType,
      Currency: Currency,
      ExchangeRate: ExchangeRate,
      Weight: Result.Weight,
      SinglePrice: WeightPrice,
      UnitPrice: UnitPrice,
      ProfitRatio: ProfitRatio,
      Remark: Remark,
      LoginAccount: Adder
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/AddQuotationResult",
        body, this.httpOptions).toPromise()
        .then(data => {
          if (data['WorkStatus'] == "OK") {
            resolve(data);
          } else {
            reject(false);
          }
        })
        .catch((error: any) => {
          reject(false);
        });
    });
    return promise;
  }

  //#endregion
}
