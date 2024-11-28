import { Injectable } from '@angular/core';
import { RestfulRequester } from 'src/app/Service/RestfulRequester.service'
import {
  AddPouringOutRecordReq,
  PouringOutRecordListReq,
  PouringOutItemList,
  PouringOutItemRep,
  UpdatePouringOutRecordReq,
  PouringOutRecordListModel,
  PouringOutRecordModel,
  PouringDataWeightListModel,
  PouringDataWeightRep,
  SinglePouringOutRecordDetailModel,
  PouringMaterialRep
} from '../Model/PouringoutData';
import { HttpErrorResponse } from '@angular/common/http';
import { Model_SinglePouringDataDetail } from '../Model/PouringData';


/**產出品紀錄Service
 * @export
 * @class PouringProductService
 * @extends {RestfulRequester}
 */
@Injectable({
  providedIn: 'root'
})

export class PouringProductService extends RestfulRequester {

  /**新增產品紀錄
   * @param {AddPouringOutRecordReq} Data 傳入出去紀錄資料
   * @param {string} LoginAccount 新增人帳號
   * @returns
   * @memberof PouringProductService
   */
  public API_Insert_AddPouringOutRecord(Data: AddPouringOutRecordReq, LoginAccount: string) {
    const myObj = {
      Creator: Data.Creator,
      Date: Data.Date,
      PouringOutItemReqs: Data.PouringOutItemReqs,
      PouringOutMaterialReqs: Data.PouringOutMaterialReqs,
      LoginAccount: LoginAccount
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/AddPouringOutRecord",
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

  /** 產出紀錄列表
   * @param {PouringOutRecordListReq} Data 產出紀錄列表Request物件
   * @param {string} ListCount ＊列表筆數
   * @param {string} PageNumber ＊列表第幾頁
   * @returns PouringOutRecordListModel
   * @memberof PouringProductService
   */
  public API_Query_PouringOutRecordList(Data: PouringOutRecordListReq, ListCount: string, PageNumber: string): Promise<PouringOutRecordListModel> {
    const myObj = {
      Creator: Data.Creator,
      StartCreateDate: Data.StartCreateDate,
      EndCreateDate: Data.EndCreateDate,
      ListCount: ListCount,
      PageNumber: PageNumber
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise<PouringOutRecordListModel>((resolve, reject) => {
      this.http.post(this.APserver + "/Api/PouringOutRecordList", body, this.httpOptions).toPromise()
        .then(data => {
          let ret: PouringOutRecordListModel = new PouringOutRecordListModel()
          let res: Array<PouringOutRecordModel> = new Array<PouringOutRecordModel>()
          let ary: Array<any> = Array.of(data['PouringOutRecordModels']);
          for (let index = 0; index < ary[0].length; index++) {
            let value: PouringOutRecordModel = new PouringOutRecordModel();
            value.POU_PouringOutRecord_ID = ary[0][index]['POU_PouringOutRecord_ID'];
            value.Creator = ary[0][index]['Creator'];
            value.CreateDate = ary[0][index]['CreateDate'];
            value.Basin = ary[0][index]['Basin'];
            value.PouringOutTotal = ary[0][index]['PouringOutTotal'];
            value.Date = ary[0][index]['Date'];
            value.PouringBatch = ary[0][index]['PouringBatch'];
            res.push(value);
          }
          ret.TotalCount = data['TotalCount'];
          ret.PouringOutRecordModels = res;
          resolve(ret);
        })
        .catch((error: HttpErrorResponse) => {
          reject(error);
        });
    });
    return promise;
  }

  /**出水產品列表
   * @returns {Promise<PouringOutItemList>}
   * @memberof PouringProductService
   */
  public API_Query_PouringOutItemList(Date: string): Promise<PouringOutItemList> {
    let promise = new Promise<PouringOutItemList>((resolve, reject) => {
      this.http.get(this.APserver + "/Api/PouringOutItemList?date=" + Date, this.httpOptions).toPromise()
        .then(data => {
          let ret: PouringOutItemList = new PouringOutItemList()
          let res: Array<PouringOutItemRep> = new Array<PouringOutItemRep>()
          let ary: Array<any> = Array.of(data);
          for (let index = 0; index < ary[0].PouringOutItemReps.length; index++) {
            let value: PouringOutItemRep = new PouringOutItemRep();
            value.ItemNumber = ary[0].PouringOutItemReps[index]['ItemNumber'];
            value.Weight = ary[0].PouringOutItemReps[index]['Weight'];
            value.ProductionHeadCode = ary[0].PouringOutItemReps[index]['ProductionHeadCode'];
            value.ProductionCode = ary[0].PouringOutItemReps[index]['ProductionCode'];
            value.MOQTY = ary[0].PouringOutItemReps[index]['MOQTY'];
            value.InQTY = ary[0].PouringOutItemReps[index]['InQTY'];
            res.push(value);
          }
          ret.PouringOutItemReps = res;
          resolve(ret);
        })
        .catch((error: HttpErrorResponse) => {
          reject(error);
        });
    });
    return promise;
  }

  /**修改產品紀錄
   * @param {UpdatePouringOutRecordReq} Data 修改產品紀錄Request物件
   * @param {string} LoginAccount 登入人帳號
   * @memberof PouringProductService
   */
  public API_SmartSearchPouringOutRecordList(UserAccount: string, SearchText: string, Page: number, PageCount: number) {
    const myObj = {
      UserAccount: UserAccount,
      SearchText: SearchText,
      Page: Page,
      PageCount: PageCount
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/SmartSearchPouringOutRecordList",
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


  /**修改產品紀錄
   * @param {UpdatePouringOutRecordReq} Data 修改產品紀錄Request物件
   * @param {string} LoginAccount 登入人帳號
   * @memberof PouringProductService
   */
  public API_Update_UpdatePouringOutRecord(Data: UpdatePouringOutRecordReq, LoginAccount: string) {
    const myObj = {
      POU_PouringOutRecord_ID: Data.POU_PouringOutRecord_ID,
      Date: Data.Date,
      Creator: Data.Creator,
      UpdatePouringOutItemReqs: Data.UpdatePouringOutItemReqs,
      UpdatePouringOutMaterialReqs: Data.UpdatePouringOutMaterialReqs,
      LoginAccount: LoginAccount
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/UpdatePouringOutRecord",
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

  /**修改產品紀錄
   * @param {UpdatePouringOutRecordReq} Data 修改產品紀錄Request物件
   * @param {string} LoginAccount 登入人帳號
   * @memberof PouringProductService
   */
  public API_Query_PouringDataWeightList2(Date: string, Account: string) {
    const myObj = {
      Date: Date,
      Account: Account
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/PouringDataWeightList2",
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

  /**澆注設置含重量資料-用於產出紀錄
   * @param {string} Date ＊澆注日期
   * @returns {Promise<PouringDataWeightListModel>} 澆注設置含重量資料清單
   * @memberof PouringProductService
   */
  public API_Query_PouringDataWeightList(Date: string): Promise<PouringDataWeightListModel> {
    const myObj = {
      Date: Date
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise<PouringDataWeightListModel>((resolve, reject) => {
      this.http.post(this.APserver + "/Api/PouringDataWeightList",
        body, this.httpOptions).toPromise()
        .then(data => {
          let ret: PouringDataWeightListModel = new PouringDataWeightListModel();
          let res: Array<PouringDataWeightRep> = new Array<PouringDataWeightRep>();
          let ary: Array<any> = Array.of(data['PouringDataWeightReps']);
          for (let index = 0; index < ary[0].length; index++) {
            let value: PouringDataWeightRep = new PouringDataWeightRep();
            value.POU_PouringData_ID = ary[0][index]['POU_PouringData_ID'];
            value.PouringContainer = ary[0][index]['PouringContainer'];
            value.PouringBatch = ary[0][index]['PouringBatch'];
            value.PDID = ary[0][index]['PDID'];
            value.MaterialTotalWeight = ary[0][index]['MaterialTotalWeight'];
            let mat: Array<PouringMaterialRep> = new Array<PouringMaterialRep>();
            ary[0][index]['PouringMaterialReps'].forEach(p => {
              let m: PouringMaterialRep = new PouringMaterialRep();
              m.MaterialName = p['MaterialName'];
              m.MaterialNo = p['MaterialNo'];
              m.MaterialType = p['MaterialType'];
              m.MaterialWeight = p['MaterialWeight'];
              m.POU_PouringMaterial_ID = p['POU_PouringMaterial_ID'];
              mat.push(p);
            })
            value.PouringMaterialReps = mat;
            res.push(value);
          }
          ret.PouringDataWeightReps = res;
          resolve(ret);
        })
        .catch((error: HttpErrorResponse) => {
          reject(error);
        });
    });
    return promise;
  }

  /**查單一紀錄詳記資料
   * @param {string} POU_PouringOutRecord_ID
   * @returns
   * @memberof PouringProductService
   */
  public API_Query_SinglePouringOutRecordDetail(POU_PouringOutRecord_ID: string) {
    let promise = new Promise((resolve, reject) => {
      this.http.get(this.APserver + "/Api/SinglePouringOutRecordDetail?POU_PouringOutRecord_ID=" + POU_PouringOutRecord_ID, this.httpOptions).toPromise()
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
