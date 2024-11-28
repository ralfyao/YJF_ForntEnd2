import { Injectable } from '@angular/core';
import * as Crypto from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class CustomValidateService {

  constructor() { }

  public AESEncrypt(data: string): string {
    var encrypt = Crypto.AES.encrypt(data, "ESTUSqaz");
    return encrypt;
  }

  public AESDecrypt(data: string): any {
    if (data != undefined || data != null) {
      const decrypt = Crypto.AES.decrypt(data, "ESTUSqaz");
      return decrypt.toString(Crypto.enc.Utf8);
    }
    return undefined;
  }

  public yyyymmdd() {
    var y = new Date().getFullYear().toString();
    var m = (new Date().getMonth() + 1).toString();
    var d = new Date().getDate().toString();
    (d.length == 1) && (d = '0' + d);
    (m.length == 1) && (m = '0' + m);
    var yyyymmdd = y + m + d;
    return yyyymmdd;
  }
}

/**正則表達式列舉
 * @export
 * @enum {number}
 */
export enum CustomRegexPattern {
  /**兩位數含小數點兩位(XX.XX)
   */
  NumberDotNumber = "([0-9]{1}[0-9]{1}.[0-9]{2})|([0-9]{1}.[0-9]{2})|([0-9]{1}[0-9]{1}.[0-9]{1})|([0-9]{1}.[0-9]{1})|([0-9]{2})|([0-9]{1})",
  /**個位數無限大，小數點最多五位(XXXXXXXXXXX.XXXXX)
 */
  BigNumberDot5Number = "([0-9].[0-9]{1})|([0-9].[0-9]{2})|([0-9].[0-9]{3})|([0-9].[0-9]{4})|([0-9].[0-9]{5})|([0-9])",
  /**兩位數不含小數點兩位(XX)
   */
  Number = "([0-9]{1}[1-9]{1})|([1-9]{1}[0-9]{1})|([1-9]{1})",
  /**僅限數字無限位數
   */
  BigNumber = "[0-9]{1,}",
  /**只可以數字跟英文大小寫
   */
  NumberAndChar = "([a-zA-Z]|[0-9])",
  /**電話格式((111)111-111111|1111-111111|11-22222222)
   */
  Phone = "^\s*(?:\+?(\d{1,3}))?([-. (]*(\d{3})[-. )]*)?((\d{3})[-. ]*(\d{2,4})(?:[-.x ]*(\d+))?)\s*$",
  /**電子郵件
   */
  Email = "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?",
  /**只可以中文
   */
  ChineseChar = "[^\x00-\xff]",
  /**只可以英文
   */
  EnglishChar = "[a-zA-Z]"
}

/**AES加解密相關參數
 * @export
 * @enum {number}
 */
export enum AESCrypto {
  /**AES密碼(不能有數字)
   */
  PasswordKey = "ESTUSqazQWE"
}




