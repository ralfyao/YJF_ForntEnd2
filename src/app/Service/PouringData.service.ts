import { RestfulRequester } from 'src/app/Service/RestfulRequester.service'
import { Injectable } from '@angular/core';
import { Model_PouringMaterial, Model_SinglePouringDataDetail } from '../Model/PouringData';
import { HttpErrorResponse } from '@angular/common/http';
import { MaterialListReq } from '../Model/ParamaterSetting';
import { MeltRecordDataRequest } from 'src/bin/meltRecordDataRequest';
import { Observable } from 'rxjs';
import { MeltRecordDataResponse } from 'src/bin/meltRecordDataResponse';
import { MeltRecordExcelFileRequest } from 'src/bin/meltRecordExcelFileRequest';
import { MeltRecordExcelFileResponse } from 'src/bin/meltRecordExcelFileResponse';
import { tap } from 'rxjs/operators';

/**爐前管制表API服務
 * @export
 * @class PouringDataService
 * @extends {RestfulRequester}
 */
@Injectable()
export class PouringDataService extends RestfulRequester {
  /**新增爐前管制資料
   * @param {Model_AddPouringData} Data Model_新增爐前管制資料
   * @returns Model_AddPouringData_Response
   * @memberof PouringDataService
   */
  public API_Insert_PouringData(Data: Model_SinglePouringDataDetail, LoginAccount: string) {
    const myObj = {
      StartTime: Data.StartTime,
      IsReturnToZero: Data.IsReturnToZero,
      Date: Data.date_id,
      EndTime: Data.EndTime,
      PouringTemp: Data.PouringTemp,
      MaterialType: Data.MaterialType,
      CE: Data.CE,
      CEC: Data.CEC,
      CESi: Data.CESi,
      Wedge1: Data.Wedge1,
      Wedge2: Data.Wedge2,
      PouringContainer: Data.PouringContainer,
      EngName: Data.EngName,
      PouringMaterialReqs: Data.PouringMaterialReps,
      B_C: Data.B_C,
      B_Cr: Data.B_Cr,
      B_Cu: Data.B_Cu,
      B_Mg: Data.B_Mg,
      B_Mn: Data.B_Mn,
      B_P: Data.B_P,
      B_S: Data.B_S,
      B_Si: Data.B_Si,
      B_Sn: Data.B_Sn,
      B_Ti: Data.B_Ti,
      A_C: Data.A_C,
      A_Cr: Data.A_Cr,
      A_Cu: Data.A_Cu,
      A_Mg: Data.A_Mg,
      A_Mn: Data.A_Mn,
      A_P: Data.A_P,
      A_S: Data.A_S,
      A_Si: Data.A_Si,
      A_Sn: Data.A_Sn,
      A_Ti: Data.A_Ti,
      LoginAccount: LoginAccount
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/AddPouringData",
        body, this.httpOptions).toPromise()
        .then((data) => {
          resolve((data));
        })
        .catch((error: any) => {
          reject(error);
        });
    });
    return promise;
  }

  /**澆鑄材料查詢
   *
   */
  public API_QueryPouringMaterialList(Account: String, PageCount: number, Page: number) {
    const myObj = {
      Account: Account,
      PageCount: PageCount,
      Page: Page
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/QueryPouringMaterialList",
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

  /**澆鑄紀錄查詢
   *
   */
  public API_PouringWeightQuery(Account: String) {
    const myObj = {
      Account: Account
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/PouringWeightQuery",
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

  /**澆鑄紀錄查詢
   *
   */
  public API_QueryMaterialStockList(Account: String) {
    const myObj = {
      Account: Account
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/QueryMaterialStockList",
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

  /**爐前管制表單一詳細資料
   * @param {String} POU_PouringData_ID ＊澆注設置ID
   * @returns Model_SinglePouringDataDetail
   * @memberof PouringDataService
   */
  public API_Query_SinglePouringData(POU_PouringData_ID: String) {
    const myObj = {
      POU_PouringData_ID: POU_PouringData_ID
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/SinglePouringDataDetail",
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

  /**澆注材料列表
   * @returns Array<Model_PouringMaterial>
   * @memberof PouringDataService
   */
  public API_Query_PouringMaterialList(req: MaterialListReq): Promise<Array<Model_PouringMaterial>> {
    const myObj = {
      MaterialType: req.MaterialType,
      MaterialNo: req.MaterialNo,
      MaterialName: req.MaterialName,
      ListCount: "9999",
      PageNumber: ""
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise<Array<Model_PouringMaterial>>((resolve, reject) => {
      this.http.post(this.APserver + "/Api/MaterialList",
        body, this.httpOptions).toPromise()
        .then(data => {
          let res: Array<Model_PouringMaterial> = new Array<Model_PouringMaterial>()
          let ary: Array<any> = Array.of(data);
          for (let index = 0; index < ary[0]['MaterialListReps'].length; index++) {
            let value: Model_PouringMaterial = new Model_PouringMaterial();
            value.MaterialName = ary[0]['MaterialListReps'][index]['MaterialName'];
            value.MaterialNo = ary[0]['MaterialListReps'][index]['MaterialNo'];
            value.MaterialType = ary[0]['MaterialListReps'][index]['MaterialType'].trim();
            value.StockQuantity = ary[0]['MaterialListReps'][index]['StockQuantity'];
            res.push(value);
          }
          resolve(res);
        })
        .catch((error: any) => {
          reject(false);
        });
    });
    return promise;
  }

  /**刪除爐前管制紀錄(成功會傳出OK)
   * @param {string} POU_PouringData_ID 澆注設置ID
   * @param {string} LoginAccount 登入者帳號
   * @returns string
   * @memberof PouringDataService
   */
  public API_SmartSearchPouringDataList(SearchText: string, UserAccount: string, Page: number, PageCount: number) {
    const myObj = {
      SearchText: SearchText,
      UserAccount: UserAccount,
      Page: Page,
      PageCount: PageCount
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/SmartSearchPouringDataList",
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

  /**刪除爐前管制紀錄(成功會傳出OK)
   * @param {string} POU_PouringData_ID 澆注設置ID
   * @param {string} LoginAccount 登入者帳號
   * @returns string
   * @memberof PouringDataService
   */
  public API_Delete_PouringData(POU_PouringData_ID: string, LoginAccount: string) {
    const myObj = {
      POU_PouringData_ID: POU_PouringData_ID,
      LoginAccount: LoginAccount
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/DeletePouringData",
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

  /** 爐前管制紀錄列表
   * @param {string} PDID 澆注編號
   * @param {string} EngName 澆注者姓名
   * @param {string} StartCreateDate 建檔日期（起）
   * @param {string} EndCreateDate 建檔日期（迄）
   * @param {string} PouringContainer 開爐容器編號
   * @param {string} ListCount ＊列表筆數
   * @param {string} PageNumber ＊列表第幾頁
   * @returns Array<Model_PouringDataListItem>
   * @memberof PouringDataService
   */
  public API_Query_PouringDataList(
    PDID: string,
    EngName: string,
    StartCreateDate: string,
    EndCreateDate: string,
    PouringContainer: string,
    ListCount: string,
    PageNumber: string) {
    const myObj = {
      PDID: PDID,
      EngName: EngName,
      StartDate: StartCreateDate,
      EndDate: EndCreateDate,
      PouringContainer: PouringContainer,
      ListCount: ListCount,
      PageNumber: PageNumber,
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/PouringDataList",
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

  /**修改溶燒記錄
   * @param {Model_AddPouringData} Data Model_新增爐前管制資料
   * @param {string} LoginAccount 新增者帳號
   * @returns 正確回傳OK
   * @memberof PouringDataService
   */
  public API_Update_PouringData(Data: Model_SinglePouringDataDetail, LoginAccount: string) {
    const myObj = {
      POU_PouringData_ID: Data.POU_PouringData_ID,
      StartTime: Data.StartTime,
      EndTime: Data.EndTime,
      PouringTemp: Data.PouringTemp,
      IsReturnToZero: Data.IsReturnToZero,
      MaterialType: Data.MaterialType,
      CE: Data.CE,
      CEC: Data.CEC,
      CESi: Data.CESi,
      Wedge1: Data.Wedge1,
      Wedge2: Data.Wedge2,
      PouringContainer: Data.PouringContainer,
      PouringBatch: Data.PouringBatch,
      EngName: Data.EngName,
      PouringMaterialReqs: Data.PouringMaterialReps,
      POU_PouringChemicalContent_ID: Data.POU_PouringChemicalContent_ID,
      B_C: Data.B_C,
      B_Cr: Data.B_Cr,
      B_Cu: Data.B_Cu,
      B_Mg: Data.B_Mg,
      B_Mn: Data.B_Mn,
      B_P: Data.B_P,
      B_S: Data.B_S,
      B_Si: Data.B_Si,
      B_Sn: Data.B_Sn,
      B_Ti: Data.B_Ti,
      A_C: Data.A_C,
      A_Cr: Data.A_Cr,
      A_Cu: Data.A_Cu,
      A_Mg: Data.A_Mg,
      A_Mn: Data.A_Mn,
      A_P: Data.A_P,
      A_S: Data.A_S,
      A_Si: Data.A_Si,
      A_Sn: Data.A_Sn,
      A_Ti: Data.A_Ti,
      LoginAccount: LoginAccount
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/UpdatePouringData",
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


  public API_meltRecordData(request: MeltRecordDataRequest): Observable<MeltRecordDataResponse> {
    const body = JSON.stringify(request);
    const url = `${this.APserver}/Api/MetlRecord`;
    return this.http.post<MeltRecordDataResponse>(url, body, { headers: this.headers })
  }

  public API_DailyReportData(Account: string) {
    const myObj = {
      Account: Account
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/DailyReportData",
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
  public API_UpdatePouringSFC(Account: string, Type: string, TransferDate: string, UpdateList: Array<any>) {
    const myObj = {
      Account: Account,
      Type: Type,
      TransferDate: TransferDate,
      UpdateList: UpdateList
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/UpdatePouringSFC",
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
  public API_ExportPouringTodo(Account: string) {
    const myObj = {
      Account: Account
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/ExportPouringTodo",
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

  public API_meltRecordExcelFile(request: MeltRecordExcelFileRequest) {
    const urlGenFile = `${this.APserver}/Api/ExportMeltRecordData`;
    const body = JSON.stringify(request);

    return this.http.post<MeltRecordExcelFileResponse>(urlGenFile, body, { headers: this.headers }).pipe(
      tap((res) => {
        let filePath = `${this.APserver}${res.ExcelFilePath}`;
        window.open(filePath);
      })
    )
  }

  public API_NoPickingList(Account: string) {
    const myObj = {
      Account: Account
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/NoPickingList",
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

  public API_GetStandardMaterial(MaterialType: string) {
    const myObj = {
      MaterialType: MaterialType
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/GetStandardMaterial",
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

  public API_Metl_Record(Account: string) {
    const myObj = {
      Account: Account
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/MetlRecord",
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
