import { RestfulRequester } from 'src/app/Service/RestfulRequester.service'
import { SessionStorageService } from 'ngx-webstorage';
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class PurchaseReportService extends RestfulRequester {
  private session: SessionStorageService
  super(session: SessionStorageService) {
    this.session = session;
  }
  public API_GetPurchaseData(Account: string, StartMonth: string, EndMonth: string, Type: string) {
    const myObj = {
      StartMonth: StartMonth,
      EndMonth: EndMonth,
      Type: Type,
      Account: Account
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/GetPurchaseData",
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
  public API_ExportPurchaseReport(Account: string, StartMonth: string, EndMonth: string, Type: string) {
    const myObj = {
      StartMonth: StartMonth,
      EndMonth: EndMonth,
      Type: Type,
      Account: Account
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/ExportPurchaseReport",
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
}
