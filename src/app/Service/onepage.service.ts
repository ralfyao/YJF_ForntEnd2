import { ParameterSettingService } from './parameter-setting.service';
import { CusOrder, ProductionLimitJson, MainProductionOrder, WIPProcess } from '../Model/production';
import { RestfulRequester } from 'src/app/Service/RestfulRequester.service'
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { SessionStorageService } from 'ngx-webstorage';
import { FlaskList, LineLeadTime, POstatus } from '../Model/production';
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class OnePageService extends RestfulRequester {
  private session: SessionStorageService
  super(session: SessionStorageService) {
    this.session = session;
  }
  public API_GetMoldChangeData(Account: string) {
    const myObj = {
      Account: Account
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/GetMoldChangeData",
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

  public API_InsertDeliveryOrder(UserCode: string, OrderDate, ItemCode, Quantity, OutWarehouse) {
    const myObj = {
      UserCode: UserCode,
      OrderDate: OrderDate,
      ItemCode: ItemCode,
      Quantity: Quantity,
      OutWarehouse: OutWarehouse
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/InsertDeliveryOrder",
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
  public API_InsertStorageOrder(UserCode: string, OrderDate: string, ItemCode: string, Quantity: number, InWarehouse: string, InLocation: string) {
    const myObj = {
      UserCode: UserCode,
      OrderDate: OrderDate,
      ItemCode: ItemCode,
      Quantity: Quantity,
      InWarehouse: InWarehouse,
      InLocation: InLocation
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/InsertStorageOrder",
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
  public API_InsertMoldAccessRecord(UserCode: string, ItemCode: string, Type: string) {
    const myObj = {
      UserCode: UserCode,
      Type: Type,
      ItemCode: ItemCode
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/InsertMoldAccessRecord",
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
  public API_ConfirmItemCode(ItemCode: string) {
    const params = new HttpParams().set('ItemCode', ItemCode);
    this.httpOptions.params = params;
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/ConfirmItemCode",
        null, this.httpOptions).toPromise()
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
