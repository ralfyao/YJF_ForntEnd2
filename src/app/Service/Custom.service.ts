import { Observable } from 'rxjs';
import { RestfulRequester } from 'src/app/Service/RestfulRequester.service'
import { Customer } from 'src/app/Model/vo';
import { Injectable } from '@angular/core';
import { QueryCustomerListRequest } from 'src/bin/queryCustomerListRequest';
import { QueryCustomerListResponse } from 'src/bin/queryCustomerListResponse';
import { InsertAddCustomerRequest } from 'src/bin/insertAddCustomerRequest';
import { InsertAddCustomerResponse } from 'src/bin/insertAddCustomerResponse';
import { BasicAPIResponse } from 'src/bin/basicAPIResponse';
import { QuerySingleCustomerDetailRequest } from 'src/bin/querySingleCustomerDetailRequest';
import { QuerySingleCustomerDetailResponse } from 'src/bin/querySingleCustomerDetailResponse';


/**客戶資料控制服務
 * @export CustomService
 * @class CustomService
 * @extends {RestfulRequester}
 */
@Injectable()
export class CustomService extends RestfulRequester {

  /**
   *取得客戶資料
   *
   * @param {QueryCustomerListRequest} request
   * @return {*}  {Observable<QueryCustomerListResponse>}
   * @memberof CustomService
   */
  public apiQueryCustomerList(request: QueryCustomerListRequest): Observable<QueryCustomerListResponse> {
    const url = `${this.APserver}/Api/CustomerList`;
    const body = JSON.stringify(request);
    return this.http.post<QueryCustomerListResponse>(url, body, { headers: this.headers })
  }

  /**
 * 查詢客戶資料(單筆)
 * @param CustomerNumber ：客戶編號
 */
  public API_UpdateCustomerVer2(CustomerNumber: string, Customer: Customer) {
    const myObj = {
      CST_Customer_ID: CustomerNumber,
      Customer: Customer
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/UpdateCustomerVer2",
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
 * 查詢客戶資料(單筆)
 * @param CustomerNumber ：客戶編號
 */
  public API_Query_SingleCustomerDetail(CustomerNumber: string) {
    const myObj = {
      CST_Customer_ID: CustomerNumber
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/SingleCustomerDetail",
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

  apiQuerySingleCustomerDetail(request: QuerySingleCustomerDetailRequest): Observable<QuerySingleCustomerDetailResponse> {
    const body = JSON.stringify(request);
    const url = `${this.APserver}/Api/SingleCustomerDetail`;
    return this.http.post<QuerySingleCustomerDetailResponse>(url, body, { headers: this.headers })
  }

  /**
   *新增客戶API
   *
   * @param {InsertAddCustomerRequest} request
   * @return {*}  {Observable<InsertAddCustomerResponse>}
   * @memberof CustomService
   */
  apiInsertAddCustomer(request: InsertAddCustomerRequest): Observable<InsertAddCustomerResponse> {
    const body = JSON.stringify(request);
    const url = `${this.APserver}/Api/AddCustomer`;
    return this.http.post<InsertAddCustomerResponse>(url, body, { headers: this.headers })
  }
  /**
   *更新客戶API
   *
   * @param {InsertAddCustomerRequest} request
   * @return {*}  {Observable<BasicAPIResponse>}
   * @memberof CustomService
   */
  apiInsertUpdateCustomer(request: InsertAddCustomerRequest): Observable<BasicAPIResponse> {
    const body = JSON.stringify(request);
    const url = `${this.APserver}/Api/UpdateCustomer`;
    return this.http.post<BasicAPIResponse>(url, body, { headers: this.headers })
  }
}
