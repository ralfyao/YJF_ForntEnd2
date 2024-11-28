import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JsonpModule, Jsonp, Response } from '@angular/http';
import { environment } from 'src/environments/environment';
import { SweetAlertService } from './sweet-alert.service';


/**
 * 這一個類別用來讓所有的Service可以對API進行存取
 * 要先繼承
 */
@Injectable()
export class RestfulRequester {
  //APserver: string = "192.168.123.28:8088";
  //APserver: string ="1.165.189.119:8011"
  //APserver: string = "estusapi.serveftp.com:8011";
  //APserver: string = "localhost:4200";
  //APserver: string = "localhost:44300";//Debug
  //APserver: string = "mail.yjfcasting.com:8089";//測試區
  //APserver: string = "mail.yjfcasting.com:8090";//新版正試區
  APserver: string = environment.APserver;
  // APserver: string = "http://localhost:2404";//新版正試區
  //APserver: string = "127.0.0.1/YJFERPBridge.WebAPi";
  httpOptions: any;
  ftpOptions: any;
  jsongetOptions: any;
  http: HttpClient;
  jsonp: Jsonp;
  headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });
  constructor(private client: HttpClient,
    private jsonpclient: Jsonp,
    private sAS: SweetAlertService
  ) {
    this.http = client;
    this.jsonp = jsonpclient;
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    this.ftpOptions = {
      headers: new HttpHeaders({

      }),
      responseType: 'text',
      reportProgress: true
    };
    this.jsongetOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'text/html'
      })
    };
  }
  /**
   *常用錯誤訊息
   *
   * @memberof RestfulRequester
   */
  commonErrorMsg() {
    this.sAS.alertFail({ text: '伺服器發生錯誤。請聯繫IT部門' });
  }
  /**
   *處理錯誤訊息
   *
   * @param {(string | HttpErrorResponse)} errorMsg
   * @memberof RestfulRequester
   */
  errorWithErrorMsg(errorMsg: string | HttpErrorResponse) {
    if (errorMsg && typeof errorMsg == 'string') {
      this.sAS.alertFail({ text: errorMsg })
    } else {
      this.commonErrorMsg();
    }
  }

  alertWithMessage(errorMsg:string|HttpErrorResponse){
    if (errorMsg && typeof errorMsg == 'string') {
      this.sAS.alert({ text: errorMsg })
    } else {
      this.commonErrorMsg();
    }
  }

  /**
   *成功訊息
   *
   * @param {string} msg
   * @memberof RestfulRequester
   */
  successMessage(msg: string) {
    this.sAS.alertSuccess({ text: msg });
  }
}
