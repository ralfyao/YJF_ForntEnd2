import { RestfulRequester } from 'src/app/Service/RestfulRequester.service'
import { Injectable } from '@angular/core';
import { PostMemberListRequest } from 'src/bin/postMemberListRequest';
import { Observable } from 'rxjs';
import { PostMemberListResponse } from 'src/bin/postMemberListResponse';
import { PostUpdateMemberStatusRequest } from 'src/bin/postUpdateMemberStatusRequest';
import { PostUpdateMemberStatusResponse } from 'src/bin/postUpdateMemberStatusResponse';
import { SupplierAllListRequest } from 'src/bin/supplierAllListRequest';
import { SupplierAllListResponse } from 'src/bin/supplierAllListResponse';

/**會員管理服務
 * @export MemberManageService
 * @class MemberManageService
 * @extends {RestfulRequester}
 */
@Injectable()
export class MemberManageService extends RestfulRequester {
  /**
   *獲取使用者名單
   *
   * @param {PostMemberListRequest} request
   * @return {*}  {Observable<PostMemberListResponse>}
   * @memberof MemberManageService
   */
  apiPostMemberList(request: PostMemberListRequest): Observable<PostMemberListResponse> {
    const body = JSON.stringify(request);
    const url = `${this.APserver}/Api/AccountManagementList`;
    return this.http.post<PostMemberListResponse>(url, body, { headers: this.headers })

  }
  /**
   *更新使用者狀態
   *
   * @param {PostUpdateMemberStatusRequest} request
   * @return {*}  {Observable<PostUpdateMemberStatusResponse>}
   * @memberof MemberManageService
   */
  apiPostUpdateMemberStatus(request: PostUpdateMemberStatusRequest): Observable<PostUpdateMemberStatusResponse> {
    const body = JSON.stringify(request);
    const url = `${this.APserver}/Api/AccountManagementSetting`;
    return this.http.post<PostUpdateMemberStatusResponse>(url, body, { headers: this.headers })

  }

  /**
   * 員工部門對照查詢
   * @param MV001 ：員工代號
   * @param MV002 : 員工姓名
   * @param MV004 : 部門代號
   */
  public API_QueryEmployeeApartList(QueryCMSMV001: string, QueryCMSMV002: string, QueryCMSMV004: string, Page: number, PageCount: number) {
    const myObj = {
      QueryCMSMV001: QueryCMSMV001,
      QueryCMSMV002: QueryCMSMV002,
      QueryCMSMV004: QueryCMSMV004,
      Page: Page,
      PageCount: PageCount
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/EmployeeApartList",
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
   *供應商查詢對照
   *
   * @param {SupplierAllListRequest} request
   * @return {*}  {Observable<SupplierAllListResponse>}
   * @memberof MemberManageService
   */
  apiSupplierAllList(request: SupplierAllListRequest): Observable<SupplierAllListResponse> {
    const body = JSON.stringify(request);
    const url = `${this.APserver}/Api/SupplierAllList`;
    return this.http.post<SupplierAllListResponse>(url, body, { headers: this.headers })
  }
}
