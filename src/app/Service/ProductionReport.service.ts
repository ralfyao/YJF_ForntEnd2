import { RestfulRequester } from 'src/app/Service/RestfulRequester.service'
import { SessionStorageService } from 'ngx-webstorage';
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { ExpectUnboxingDataResponse } from 'src/bin/expectUnboxingDataResponse';
import { ExpectUnboxingDataRequest } from 'src/bin/expectUnboxingDataRequest';
import { PostProcEstiProdResponse } from 'src/bin/postProcEstiProdResponse';
import { BasicAPIResponse } from 'src/bin/basicAPIResponse';
import { queryPostProcEstiProdRes } from 'src/bin/queryPostProcEstiProdResult';


@Injectable()
export class ProdutionReportService extends RestfulRequester {
  apiPostProcWeek(week:string, workOrder:string):Observable<BasicAPIResponse>{
    const url = `${this.APserver}/Api/PostProcWeek?week=${week}&ProductionOrder=${workOrder.trim()}`;
    return this.http.get<BasicAPIResponse>(url);
  }
  apiQueryProdProcEstProd(param: any) :Observable<queryPostProcEstiProdRes>{
    const body = JSON.stringify(param);
    const url = `${this.APserver}/api/QueryProdProcEstProd`;
    return this.http.post<queryPostProcEstiProdRes>(url, body, { headers:this.headers});
  }
  API_ExportExpectUnboxingTotal(UserAccount: any
    , MoldingStartDate: string
    , MoldingEndDate: string
    , ETDFilterStartDate: string
    , ETDFilterEndDate: string
    , UnboxingStartDate: string
    , UnboxingEndDate: string
    , UnpackingPlanStartDate2: string
    , UnpackingPlanStartDate2End: string
    , ProductionOrderText: string
    , ItemCodeText: string
    , FlaskText: string
    , orders: string) {
      const myObj = {
        Account: UserAccount,
        MoldingStartDate: MoldingStartDate,
        MoldingEndDate: MoldingEndDate,
        ETDFilterStartDate: ETDFilterStartDate,
        ETDFilterEndDate: ETDFilterEndDate,
        UnboxingStartDate: UnboxingStartDate,
        UnboxingEndDate: UnboxingEndDate,
        UnboxingPlanStartDate2:UnpackingPlanStartDate2,
        UnboxingPlanStartDate2End:UnpackingPlanStartDate2End,
        ProductionOrderText: ProductionOrderText,
        ItemCodeText: ItemCodeText,
        FlaskText: FlaskText,
        orderType: orders
      };
      let body = JSON.stringify(myObj);
      let promise = new Promise((resolve, reject) => {
        this.http.post(this.APserver + "/Api/ExportExpectUnboxing2ByGroup",
          body, this.httpOptions).toPromise()
          .then(data => {
            data["ExcelFilePath"] = this.APserver + data["ExcelFilePath"];
            resolve(data);
          })
          .catch((error: any) => {
            reject(false);
          });
      });
      return promise;
  }

  API_PostProcProdSign(workOrder: string) : Observable<BasicAPIResponse> {
    const url = `${this.APserver}/Api/PostProcProdSign`;
    const body = {
      WorkOrder:workOrder
    };
    return this.http.post<BasicAPIResponse>(url, body, { headers: this.headers })
  }

  private session: SessionStorageService
  super(session: SessionStorageService) {
    this.session = session;
  }

  public API_requestExpectUnboxingData(request: ExpectUnboxingDataRequest): Observable<ExpectUnboxingDataResponse> {
    const url = `${this.APserver}/Api/ExpectUnboxingData`;
    const body = JSON.stringify(request);
    return this.http.post<ExpectUnboxingDataResponse>(url, body, { headers: this.headers })

  }

  public API_requestExpectUnboxingData2(request: ExpectUnboxingDataRequest): Observable<ExpectUnboxingDataResponse> {
    const url = `${this.APserver}/Api/ExpectUnboxingData2`;
    const body = JSON.stringify(request);
    return this.http.post<ExpectUnboxingDataResponse>(url, body, { headers: this.headers })

  }

  public API_GetDoingList(Account: string) {
    const myObj = {
      Account: Account
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/GetDoingList",
        body, this.httpOptions).toPromise()
        .then(data => {
          resolve(data);
        })
        .catch((error: any) => {
          reject(error);
        });
    });
    return promise;
  }

  /**
   *
   *匯出有砂心沒造模Excel
   * @param {string} Account
   * @return {*}
   * @memberof ProdutionReportService
   */
  public API_ExportMoldingUndo(Account: string) {
    const myObj = {
      Account: Account
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/ExportMoldingUndo",
        body, this.httpOptions).toPromise()
        .then(data => {
          data["ExcelFilePath"] = this.APserver + data["ExcelFilePath"];
          resolve(data);
        })
        .catch((error: any) => {
          reject(false);
        });
    });
    return promise;
  }

  API_PostProcEstiProd(): Observable<PostProcEstiProdResponse> {
    const url = `${this.APserver}/Api/PostProcEstiProdRpt`;
    return this.http.get<PostProcEstiProdResponse>(url);
  }


  /**
 *
 *匯出有造模沒砂心Excel
 * @param {string} Account
 * @return {*}
 * @memberof ProdutionReportService
 */
  public API_ExportCoreUndo(Account: string) {
    const myObj = {
      Account: Account
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/ExportCoreUndo",
        body, this.httpOptions).toPromise()
        .then(data => {
          data["ExcelFilePath"] = this.APserver + data["ExcelFilePath"];
          resolve(data);
        })
        .catch((error: any) => {
          reject(false);
        });
    });
    return promise;
  }
  /**
   *
   *匯出有造模沒砂心Excel
   * @param {string} Account
   * @return {*}
   * @memberof ProdutionReportService
   */
  public API_ExportAsemblingTodo(Account: string) {
    const myObj = {
      Account: Account
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/ExportAsemblingTodo",
        body, this.httpOptions).toPromise()
        .then(data => {
          data["ExcelFilePath"] = this.APserver + data["ExcelFilePath"];
          resolve(data);
        })
        .catch((error: any) => {
          reject(false);
        });
    });
    return promise;
  }
  /**
*
*匯出拆箱預計日期報表Excel
* @param {string} Account
* @return {*}
* @memberof ProdutionReportService
*/
  public API_ExportExpectUnboxing(Account: string,
    MoldingStartDate: string,
    MoldingEndDate: string,
    ETDFilterStartDate: string,
    ETDFilterEndDate: string,
    UnboxingStartDate: string,
    UnboxingEndDate: string,
    ProductionOrderText: string,
    ItemCodeText: string,
    FlaskText: string, orderType: string) {
    const myObj = {
      Account: Account,
      MoldingStartDate: MoldingStartDate,
      MoldingEndDate: MoldingEndDate,
      ETDFilterStartDate: ETDFilterStartDate,
      ETDFilterEndDate: ETDFilterEndDate,
      UnboxingStartDate: UnboxingStartDate,
      UnboxingEndDate: UnboxingEndDate,
      ProductionOrderText: ProductionOrderText,
      ItemCodeText: ItemCodeText,
      FlaskText: FlaskText,
      orderType: orderType
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/ExportExpectUnboxing",
        body, this.httpOptions).toPromise()
        .then(data => {
          data["ExcelFilePath"] = this.APserver + data["ExcelFilePath"];
          resolve(data);
        })
        .catch((error: any) => {
          reject(false);
        });
    });
    return promise;
  }

  public API_ExportExpectUnboxing2(Account: string,
    MoldingStartDate: string,
    MoldingEndDate: string,
    ETDFilterStartDate: string,
    ETDFilterEndDate: string,
    UnboxingStartDate: string,
    UnboxingEndDate: string,
    UnpackingPlanStartDate2: string,
    UnpackingPlanStartDate2End: string,
    ProductionOrderText: string,
    ItemCodeText: string,
    FlaskText: string, orderType: string) {
    const myObj = {
      Account: Account,
      MoldingStartDate: MoldingStartDate,
      MoldingEndDate: MoldingEndDate,
      ETDFilterStartDate: ETDFilterStartDate,
      ETDFilterEndDate: ETDFilterEndDate,
      UnboxingStartDate: UnboxingStartDate,
      UnboxingEndDate: UnboxingEndDate,
      UnboxingPlanStartDate2:UnpackingPlanStartDate2,
      UnboxingPlanStartDate2End:UnpackingPlanStartDate2End,
      ProductionOrderText: ProductionOrderText,
      ItemCodeText: ItemCodeText,
      FlaskText: FlaskText,
      orderType: orderType
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/ExportExpectUnboxing2",
        body, this.httpOptions).toPromise()
        .then(data => {
          data["ExcelFilePath"] = this.APserver + data["ExcelFilePath"];
          resolve(data);
        })
        .catch((error: any) => {
          reject(false);
        });
    });
    return promise;
  }

  public API_ReportData(Account: string) {
    const myObj = {
      Account: Account
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/ReportData",
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

  public API_ReportInfo(reportId: number) {
    const myObj = {
      reportId: reportId
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/ReportInfo",
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

  public API_ReportSave(Account: string, ReportInfo) {
    const myObj = {
      Account: Account,
      Report: ReportInfo
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/ReportSave",
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

  public API_ReportSource(SourceAPI: string) {
    const myObj = {
      Account: 'admin'
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/" + SourceAPI,
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

  public API_ShipmentData(Account: string, ETDStartDate: string, ETDEndDate: string) {
    const myObj = {
      Account: Account,
      ETDStartDate: ETDStartDate,
      ETDEndDate: ETDEndDate
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/ShipmentData",
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

  public API_AsemblingChartData() {
    const myObj = {};
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/AsemblingChartData",
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
}





