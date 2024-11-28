import { RestfulRequester } from 'src/app/Service/RestfulRequester.service'
import { SinglePermissionPerson } from '../Model/vo';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PageDataResponse } from 'src/bin/pageDataResponse';
import { UpdatePageRequest } from 'src/bin/updatePageRequest';
import { BasicAPIResponse } from 'src/bin/basicAPIResponse';
import { DeletePageRequest } from 'src/bin/deletePageRequest';
import { MenuDataResponse } from 'src/bin/menuDataResponse';
import { UpdateMenuGroupResponse } from 'src/bin/updateMenuGroupResponse';
import { UpdateMenuGroupRequest } from 'src/bin/updateMenuGroupRequest';
import { GetMenuRequest } from 'src/bin/getMenuRequest';
import { GetMenuResponse } from 'src/bin/getMenuResponse';
import { DeleteMenuGroupRequest } from 'src/bin/deleteMenuGroupRequest';
import { UpdateMenuRequest } from 'src/bin/updateMenuRequest';
import { DeleteMenuRequest } from 'src/bin/deleteMenuRequest';

@Injectable()
export class PermissionService extends RestfulRequester {

  /**
  * 新增角色
  * @param Name 角色名稱
  * @param Adder 登入者帳號
  */
  public API_Insert_AddPermissionGroup(Name: string, Adder: string) {
    const myObj = {
      Name: Name,
      LoginAccount: Adder
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/AddPermissionGroup",
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
  * 修改角色
  * @param SYS_PermissionGroup_ID //角色ID
  * @param Name 角色名稱
  * @param Adder 登入者帳號
  */
  public API_Update_UpdPermissionGroup(SYS_PermissionGroup_ID: string, Name: string, Adder: string) {
    const myObj = {
      SYS_PermissionGroup_ID: SYS_PermissionGroup_ID,
      Name: Name,
      LoginAccount: Adder
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/UpdatePermissionGroup",
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
   * 刪除角色
   * @param SYS_PermissionGroup_ID //角色ID
   * @param Adder 登入者帳號
   */
  public API_Delete_DelPermissionGroup(SYS_PermissionGroup_ID: string, Adder: string) {
    const myObj = {
      SYS_PermissionGroup_ID: SYS_PermissionGroup_ID,
      LoginAccount: Adder
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/DeletePermissionGroup",
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
   * 撈角色資料用
   * @param ListCount：列表X筆數(一次要列幾筆=X)
   * @param PageNumber：列表第幾頁(每頁X筆的第幾頁)
   */
  public API_Query_PermissionGroupList(ListCount: string, PageNumber: string, GroupName: string) {
    const myObj = {
      Name: GroupName,
      ListCount: ListCount,
      PageNumber: PageNumber
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/PermissionGroupList",
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
   * 撈員工資料用(只有啟用的跟身分是員工)
   * @param ListCount：列表X筆數(一次要列幾筆=X)
   * @param PageNumber：列表第幾頁(每頁X筆的第幾頁)
   * @param UserAccount:成員帳號
   * @param Name:成員名稱
   */
  public API_Query_EmployeeList(ListCount: string, PageNumber: string, UserAccount: string, Name: string) {
    const myObj = {
      UserAccount: UserAccount,
      Name: Name,
      Status: "1",
      ListCount: ListCount,
      PageNumber: PageNumber,
      AccountIdentity: "1"  // 帳號身份 1.員工 2.供應商
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

  /**
   * 移除成員
   * @param SYS_PermissionGroup_ID 角色ID
   * @param UserAccount 員工帳號
   * @param Adder 登入者帳號
   */
  public API_Delete_DeletePermissionPerson(SYS_PermissionGroup_ID: string, UserAccount: string, Adder: string) {
    const myObj = {
      SYS_PermissionGroup_ID: SYS_PermissionGroup_ID,
      UserAccount: UserAccount,
      LoginAccount: Adder
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/DeletePermissionPerson",
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
   * 修改角色群組管理者
   * @param SYS_PermissionGroup_ID 角色ID
   * @param UserAccount 員工帳號
   * @param Adder 登入者帳號
   */
  public API_Update_UpdatePermissionGroupAdmin(SYS_PermissionGroup_ID: string, UserID: string, Adder: string) {
    const myObj = {
      SYS_PermissionGroup_ID: SYS_PermissionGroup_ID,
      USR_Employee_ID: UserID,
      LoginAccount: Adder
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/UpdatePermissionGroupAdmin",
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
   * 單一角色權限資料
   * @param SYS_PermissionGroup_ID 角色ID
   */
  public API_Query_SinglePermission(SYS_PermissionGroup_ID: string) {
    const myObj = {
      SYS_PermissionGroup_ID: SYS_PermissionGroup_ID
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/SinglePermission",
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
   * 修改角色權限資料
   * @param PermissionList 角色權限資料
   * @param Adder 登入者帳號
   */
  public API_Update_UpdatePermission(PermissionList: any, Adder: string) {
    const myObj = {
      PermissionReqs: PermissionList,
      LoginAccount: Adder
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/UpdatePermission",
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
   * 登入者權限資料
   *
   * @param {string} LoginAccount 使用者帳號
   * @returns
   * @memberof PermissionService
   */
  public API_Query_PermissionPersonSource(LoginAccount: string) {
    const myObj = {
      LoginAccount: LoginAccount
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/PermissionPersonSource",
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

  public GetPermission(Permission: Array<SinglePermissionPerson>, PermissionCode: string, PremissionOpen: string, Account: string): boolean {
    let result: boolean = false;
    if (Account == 'admin') {
      result = true
    }
    for (let index = 0; index <= Permission.length; index++) {
      if (Permission[index]?.PermissionCode == PermissionCode) {
        result = true;
        break
      }
    }
    return true
  }
  //#region Menu管理

  apiMenuData(): Observable<MenuDataResponse> {
    const body = JSON.stringify({});
    const url = `${this.APserver}/Api/MenuData`;
    return this.http.post<MenuDataResponse>(url, body, { headers: this.headers })
  }

  apiUpdateMenuGroup(request: UpdateMenuGroupRequest): Observable<UpdateMenuGroupResponse> {
    const body = JSON.stringify(request);
    const url = `${this.APserver}/Api/UpdateMenuGroup`;
    return this.http.post<UpdateMenuGroupResponse>(url, body, { headers: this.headers })
  }

  apiDeleteMenuGroup(request: DeleteMenuGroupRequest): Observable<BasicAPIResponse> {
    const body = JSON.stringify(request);
    const url = `${this.APserver}/Api/DeleteMenuGroup`;
    return this.http.post<BasicAPIResponse>(url, body, { headers: this.headers })
  }

  apiUpdateMenu(request: UpdateMenuRequest): Observable<BasicAPIResponse> {
    const body = JSON.stringify(request);
    const url = `${this.APserver}/Api/UpdateMenu`;
    return this.http.post<BasicAPIResponse>(url, body, { headers: this.headers })
  }

  public API_DeleteMenu(Account: string, MenuId: number) {
    const myObj = {
      MenuId: MenuId,
      Account: Account
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/DeleteMenu",
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

  apiDeleteMenu(request: DeleteMenuRequest): Observable<BasicAPIResponse> {
    const body = JSON.stringify(request);
    const url = `${this.APserver}/Api/DeleteMenu`;
    return this.http.post<BasicAPIResponse>(url, body, { headers: this.headers })
  }

  /**
   *獲取選單(更新左邊選單用)
   * @param {string} Account
   * @return {*}
   * @memberof PermissionService
   */
  public API_GetMenu(Account: string) {
    const myObj = {
      Account: Account
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/GetMenu",
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

  apiGetMenu(request: GetMenuRequest): Observable<GetMenuResponse> {
    const body = JSON.stringify(request);
    const url = `${this.APserver}/Api/GetMenu`;
    return this.http.post<GetMenuResponse>(url, body, { headers: this.headers })
  }

  /**
   *頁面管理
   *
   * @return {*}  {Observable<PageDataResponse>}
   * @memberof PermissionService
   */
  apiPageData(): Observable<PageDataResponse> {
    const body = JSON.stringify({});
    const url = `${this.APserver}/Api/PageData`;
    return this.http.post<PageDataResponse>(url, body, { headers: this.headers })
  }

  /**
   *編輯頁面資料
   *
   * @param {UpdatePageRequest} request
   * @return {*}  {Observable<BasicAPIResponse>}
   * @memberof PermissionService
   */
  apiUpdatePage(request: UpdatePageRequest): Observable<BasicAPIResponse> {
    const body = JSON.stringify(request);
    const url = `${this.APserver}/Api/UpdatePage`;
    return this.http.post<BasicAPIResponse>(url, body, { headers: this.headers })
  }
  /**
   *刪除頁面
   *
   * @param {DeletePageRequest} request
   * @return {*}  {Observable<BasicAPIResponse>}
   * @memberof PermissionService
   */
  apiDeletePage(request: DeletePageRequest): Observable<BasicAPIResponse> {
    const body = JSON.stringify(request);
    const url = `${this.APserver}/Api/DeletePage`;
    return this.http.post<BasicAPIResponse>(url, body, { headers: this.headers })
  }
  //#endregion
  //#region 權限管理
  public API_PermissionData() {
    const myObj = {};
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/PermissionData",
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
   * 群組角色儲存(新增、修改)
   * @param Account
   * @param GroupRole
   * @returns
   */
  public API_GroupRoleSave(Account: string, GroupRole) {
    const myObj = {
      Account: Account,
      GroupRole: GroupRole
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/GroupRoleSave",
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
   * 群組人員儲存(新增、修改)
   * @param Account
   * @param GroupPerson
   * @returns
   */
  public API_GroupPersonSave(Account: string, GroupPerson) {
    const myObj = {
      Account: Account,
      GroupPerson: GroupPerson
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/GroupPersonSave",
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
   * 群組儲存(包含角色權限)(新增、修改)
   * @param Account
   * @param PermissionList
   * @returns
   */
  public API_GroupSave(Account: string, PermissionGroup) {
    const myObj = {
      Account: Account,
      PermissionGroup: PermissionGroup
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/GroupSave",
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
   * 群組權限儲存(新增、修改)
   * @param Account
   * @param PermissionGroup
   * @returns
   */
  public API_GroupPermissionSave(Account: string, PermissionGroup) {
    const myObj = {
      Account: Account,
      PermissionList: PermissionGroup
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/GroupPermissionSave",
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
   *群組權限刪除
   * @param {string} Account
   * @param {number} GroupId
   * @return {*}
   * @memberof PermissionService
   */
  public API_GroupDelete(Account: string, GroupId: number) {
    const myObj = {
      GroupId: GroupId,
      Account: Account
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/GroupDelete",
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
   *群組角色刪除
   * @param {string} Account
   * @param {number} GroupId
   * @return {*}
   * @memberof PermissionService
   */
  public API_GroupRoleDelete(Account: string, GroupRoleId: number) {
    const myObj = {
      GroupRoleId: GroupRoleId,
      Account: Account
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/GroupRoleDelete",
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
   *群組人員刪除
   * @param {string} Account
   * @param {number} GroupId
   * @return {*}
   * @memberof PermissionService
   */
  public API_GroupPersonDelete(Account: string, GroupPersonId: number) {
    const myObj = {
      GroupPersonId: GroupPersonId,
      Account: Account
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/GroupPersonDelete",
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
}
