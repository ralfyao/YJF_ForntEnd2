import { RestfulRequester } from 'src/app/Service/RestfulRequester.service'
import { Injectable } from '@angular/core';
import { IdentifyFaceResult } from '../Model/azure-face-idservice';
import { Observable } from 'rxjs';
import { OutsourceLoginResult } from 'src/bin/OutsourceLoginResult';

/**登入控制服務
 * @export LoginService
 * @class LoginService
 * @extends {RestfulRequester}
 */
@Injectable()

export class LoginService extends RestfulRequester {

  /**API_DoLogin 登入驗證用
   * @param userid :使用者帳號
   * @param password ：使用者密碼
   */
  public API_DoLogin(userid: string, password: string) {
    const myObj = {
      UserAccount: userid,
      UserPWD: password
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/Login",
        body, this.httpOptions).toPromise()
        .then(data => {
          if (data['ErrorMsg'] == "" || data['ErrorMsg'] == null) {
            resolve(data);
            if (data["Token"])
            {
              console.log(data["Token"]);
              localStorage.setItem("Token", data["Token"]);
            }
          }
          else {
            reject(false);
          }
        })
        .catch((error: any) => {
          reject(false);
        });
    });
    return promise;
  }
  public apiOutsourceLogin(account:string):Observable<OutsourceLoginResult>{
    const url = `${this.APserver}/api/OutsourceLogin?account=${account}`;
    return this.http.get<OutsourceLoginResult>(url);
  }
  /**
   *
   * @param userid
   * @param password
   * @returns
   */
  public API_FaceIDLogin(Result: IdentifyFaceResult) {
    const myObj = {
      Result: Result
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/FaceIDLogin",
        body, this.httpOptions).toPromise()
        .then(data => {
          if (data['ErrorMsg'] == "" || data['ErrorMsg'] == null) {
            resolve(data);
          }
          else {
            reject(false);
          }
        })
        .catch((error: any) => {
          reject(false);
        });
    });
    return promise;
  }

  /**忘記密碼專用API
   * @param userid:使用者帳號
   */
  public API_ForgetPassword(userid: string) {
    const myObj = {
      UserAccount: userid
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/ForgotPWD",
        body, this.httpOptions).toPromise()
        .then(data => {
          if (data['WorkStatus'] == "OK" && data['ErrorMsg'] == "") {
            resolve("OK");
          }
          else if (data['WorkStatus'] == "Fail" && data['ErrorMsg'] == "不是此系統會員，請確認") {
            resolve("Fail");
          }
          else if (data['WorkStatus'] == "" && data['ErrorMsg'] == "") {
            resolve("");
          }
          else if (data['WorkStatus'] == "Fail") {
            reject(data['ErrorMsg'] == "不是此系統會員，請確認");
          }
        })
        .catch((error: any) => {
          reject("功能執行失敗，請聯絡系統管理者");
        });
    });
    return promise;
  }

  /**修改密碼API
   * @param userid 使用者帳號
   * @param password 使用者密碼
   */
  public API_ModifyPassword(userid: string, password: string, newpassword: string) {
    const myObj = {
      UserAccount: userid,
      UserPWD: password,
      ChangeUserPWD: newpassword
    };
    let body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.http.post(this.APserver + "/Api/ChangePWD",
        body, this.httpOptions).toPromise()
        .then(data => {
          if (data['WorkStatus'] == "OK" && data['ErrorMsg'] == "") {
            resolve("OK");
          }
          else {
            reject("Fail");
          }
        })
        .catch((error: any) => {
          reject(error);
        });
    });
    return promise;
  }
}
