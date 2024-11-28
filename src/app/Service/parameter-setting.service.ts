import { Injectable } from '@angular/core';
import { SessionStorageService } from 'ngx-webstorage';
import { RestfulRequester } from './RestfulRequester.service';
import { MaterialListReq, MaterialListModel, MaterialListRep, ShutDownRepListModel, AddMaterialReq, QuoteTypeListModel, QuoteTypeRep, ShutDownRep, AddQuoteTypeReq, UpdateQuoteType, AddShutDownReq, UpdateShutDown } from '../Model/ParamaterSetting';
import { format } from 'url';
import { HttpErrorResponse } from '@angular/common/http';
import { Model_PouringMaterial } from '../Model/PouringData';

@Injectable({
  providedIn: 'root'
})
export class ParameterSettingService extends RestfulRequester {
  private session: SessionStorageService
  super(session: SessionStorageService) {
    this.session = session;
  }


  /* #region  爐前管制紀錄參數 */

  /**查詢材料列表
   * @param {MaterialListReq} dto 查詢條件DTO
   * @param {string} ListCount 每頁幾筆
   * @param {string} PageNumber 查第幾頁
   * @returns
   * @memberof ParameterSettingService
   */
  public API_Query_MaterialList(dto: MaterialListReq, ListCount: string, PageNumber: string): Promise<MaterialListModel> {
    const myObj = {
      MaterialType: dto.MaterialType,
      MaterialNo: dto.MaterialNo,
      MaterialName: dto.MaterialName,
      ListCount: ListCount,
      PageNumber: PageNumber
    };
    let body = JSON.stringify(myObj);
    let promise: Promise<MaterialListModel> = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/MaterialList",
        body, this.httpOptions).toPromise()
        .then(data => {
          let model: MaterialListModel = new MaterialListModel(this.session);
          let ary: Array<any> = Array.of(data);
          for (let index = 0; index < ary[0]['MaterialListReps'].length; index++) {
            let value: MaterialListRep = new MaterialListRep(this.session);
            value.SYS_Material_ID = ary[0]['MaterialListReps'][index]['SYS_Material_ID'];
            value.MaterialNo = ary[0]['MaterialListReps'][index]['MaterialNo'];
            value.MaterialType = ary[0]['MaterialListReps'][index]['MaterialType'];
            value.MaterialName = ary[0]['MaterialListReps'][index]['MaterialName'];
            model.MaterialListReps.push(value);
          }
          model.TotalCount = ary[0]['TotalCount'];
          model.WorkStatus = ary[0]['WorkStatus'];
          resolve(model);
        })
        .catch((error: HttpErrorResponse) => {
          reject(error);
        });
    });
    return promise;
  }

  /**澆注材料列表
 * @returns Array<Model_PouringMaterial>
 * @memberof PouringDataService
 */
  public API_Query_PouringMaterialList(): Promise<Array<Model_PouringMaterial>> {
    const myObj = {
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise<Array<Model_PouringMaterial>>((resolve, reject) => {
      this.http.post(this.APserver + "/Api/PouringMaterialList?value={value}",
        body, this.httpOptions).toPromise()
        .then(data => {
          let res: Array<Model_PouringMaterial> = new Array<Model_PouringMaterial>()
          let ary: Array<any> = Array.of(data);
          for (let index = 0; index < ary[0].length; index++) {
            let value: Model_PouringMaterial = new Model_PouringMaterial();
            value.MaterialName = ary[0][index]['MaterialName'];
            value.MaterialNo = ary[0][index]['MaterialNo'];
            value.MaterialType = ary[0][index]['MaterialType'];
            value.MaterialType = value.MaterialType.toString().trim();
            res.push(value);
          }
          resolve(res);
        })
        .catch((error: any) => {
          reject(error);
        });
    });
    return promise;
  }

  /**新增產品紀錄
 * @param {AddMaterialReq} Data 傳入出去紀錄資料
 * @param {string} LoginAccount 新增人帳號
 * @returns
 * @memberof PouringProductService
 */
  public API_Insert_AddMaterial(Data: AddMaterialReq) {
    const myObj = {
      MaterialType: Data.MaterialType,
      MaterialReqs: Data.MaterialReqs,
      LoginAccount: Data.GetLoginAccount()
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/AddMaterial",
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

  /**查異常原因種類
   * @param {string} ListCount
   * @param {string} PageNumber
   * @returns {Promise<ShutDownRepListModel>}
   * @memberof ParameterSettingService
   */
  public API_Query_ShutDownList(ListCount: string, PageNumber: string): Promise<ShutDownRepListModel> {
    const myObj = {
      ListCount: ListCount,
      PageNumber: PageNumber
    };
    let body = JSON.stringify(myObj);
    let promise: Promise<ShutDownRepListModel> = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/ShutDownList",
        body, this.httpOptions).toPromise()
        .then(data => {
          let model: ShutDownRepListModel = new ShutDownRepListModel(this.session);
          let ary: Array<any> = Array.of(data);
          for (let index = 0; index < ary[0]['ShutDownReqs'].length; index++) {
            let value: ShutDownRep = new ShutDownRep(this.session);
            value.ShutDownName = ary[0]['ShutDownReqs'][index]['ShutDownName'];
            value.SYS_ShutDown_ID = ary[0]['ShutDownReqs'][index]['SYS_ShutDown_ID'];
            value.Representative = ary[0]['ShutDownReqs'][index]['Representative'];
            model.ShutDownRep.push(value);
          }
          model.TotalCount = ary[0]['TotalCount'];
          model.WorkStatus = ary[0]['WorkStatus'];
          resolve(model);
        })
        .catch((error: HttpErrorResponse) => {
          reject(error);
        });
    });
    return promise;
  }

  /*新增錯誤原因*/
  public API_Insert_ShutDown(Data: AddShutDownReq) {
    const myObj = {
      ShutDownName: Data.ShutDownName,
      Representative: Data.Representative,
      LoginAccount: Data.GetLoginAccount()
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/AddShutDownName",
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

  /*異動錯誤原因*/
  public API_Update_ShutDown(Data: UpdateShutDown) {
    const myObj = {
      SYS_ShutDown_ID: Data.SYS_ShutDown_ID,
      ShutDownName: Data.ShutDownName,
      Representative: Data.Representative,
      LoginAccount: Data.GetLoginAccount()
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/UpdateShutDown",
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

  /*刪除錯誤原因 */
  public API_Delete_ShutDown(Data: UpdateShutDown) {
    const myObj = {
      SYS_ShutDown_ID: Data.SYS_ShutDown_ID,
      LoginAccount: Data.GetLoginAccount()
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/DeleteShutDown",
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

  /**查報價種類資料
   * @param {string} ListCount
   * @param {string} PageNumber
   * @returns {Promise<QuoteTypeListModel>}
   * @memberof ParameterSettingService
   */
  public API_Query_QuoteTypeList(ListCount: string, PageNumber: string): Promise<QuoteTypeListModel> {
    const myObj = {
      ListCount: ListCount,
      PageNumber: PageNumber
    };
    let body = JSON.stringify(myObj);
    let promise: Promise<QuoteTypeListModel> = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/QuoteTypeList",
        body, this.httpOptions).toPromise()
        .then(data => {
          let model: QuoteTypeListModel = new QuoteTypeListModel(this.session);
          let ary: Array<any> = Array.of(data);
          for (let index = 0; index < ary[0]['QuoteTypeReps'].length; index++) {
            let value: QuoteTypeRep = new QuoteTypeRep(this.session);
            value.QuoteTypeName = ary[0]['QuoteTypeReps'][index]['QuoteTypeName'];
            value.SYS_QuoteType_ID = ary[0]['QuoteTypeReps'][index]['SYS_QuoteType_ID'];
            value.Representative = ary[0]['QuoteTypeReps'][index]['Representative'];
            value.PartNo = ary[0]['QuoteTypeReps'][index]['PartNo'];
            model.QuoteTypeReps.push(value);
          }
          model.TotalCount = ary[0]['TotalCount'];
          model.WorkStatus = ary[0]['WorkStatus'];
          resolve(model);
        })
        .catch((error: HttpErrorResponse) => {
          reject(error);
        });
    });
    return promise;
  }

  /*新增報價種類*/
  public API_Insert_QuoteType(Data: AddQuoteTypeReq) {
    const myObj = {
      QuoteTypeName: Data.QuoteTypeName,
      Representative: Data.Representative,
      PartNo: Data.PartNo,
      LoginAccount: Data.GetLoginAccount()
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/AddQuoteType",
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

  public API_Update_QuoteType(Data: UpdateQuoteType) {
    const myObj = {
      SYS_QuoteType_ID: Data.SYS_QuoteType_ID,
      QuoteTypeName: Data.QuoteTypeName,
      Representative: Data.Representative,
      PartNo: Data.PartNo,
      LoginAccount: Data.GetLoginAccount()
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/UpdateQuoteType",
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

  /*刪除報價種類 */
  public API_Delete_QuoteType(Data: UpdateQuoteType) {
    const myObj = {
      SYS_QuoteType_ID: Data.SYS_QuoteType_ID,
      LoginAccount: Data.GetLoginAccount()
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/DeleteQuoteType",
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


  /* #endregion */




}
